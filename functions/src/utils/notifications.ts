import {
  userCollection,
  app,
  addNotification,
  getUser,
} from "../api/firestore";
import {User} from "../entities/User";
import admin from "firebase-admin";
import {InviteEmailPayload} from "../entities/Email";
import {Notification} from "../entities/Notification";
import {getTodaysDate} from "./date";
import {logger} from "firebase-functions/v1";
import {BatchResponse} from "firebase-admin/lib/messaging/messaging-api";

interface SendNotificationParams {
  recipientId: string;
  title: string;
  body: string;
  data?: any;
}

export async function sendNotification(params: SendNotificationParams) {
  const {recipientId, title, body, data} = params;
  try {
    const user = await getUser(recipientId);

    if (user === undefined || user === null) {
      throw new Error("User is undefined.");
    }

    const result = await admin.messaging(app).sendEachForMulticast({
      tokens: user.messagingToken,
      data: {
        notifee: JSON.stringify({
          body,
          title,
          data,
          android: {
            channelId: "default",
          },
        }),
      },
    });

    const tokensToRemove = await getInvalidTokensFromResult(result, user);
    await removeTokens(tokensToRemove, user);
  } catch (error) {
    logger.error(error);
  }
}

async function getInvalidTokensFromResult(result: BatchResponse, user: User) {
  const tokensToRemove: string[] = [];
  result.responses.forEach((response, index) => {
    const error = response.error;
    if (error) {
      logger.error(
          "Failure sending notification to",
          user.messagingToken[index],
          error
      );
      // Cleanup the tokens that are not registered anymore.
      if (
        error.code === "messaging/invalid-registration-token" ||
        error.code === "messaging/registration-token-not-registered"
      ) {
        tokensToRemove.push(user.messagingToken[index]);
      }
    } else {
      logger.info("MESSAGE SENT!", response);
    }
  });

  return tokensToRemove;
}

async function removeTokens(tokensToRemove: string[], user: User) {
  if (tokensToRemove && tokensToRemove.length) {
    logger.info("Updating user tokens for id", user.uid);
    user.messagingToken = user.messagingToken.filter(
        (token) => !tokensToRemove.includes(token)
    );
    await userCollection
        .doc(user.uid)
        .update({messagingToken: user.messagingToken});
    logger.info("User tokens updated");
  }
}

/**
 * Creates a notification and stores it
 * @param recipientId
 * @param invite
 */
export async function createInviteNotification(
    user: User,
    invite: InviteEmailPayload
) {
  const notification: Notification = {
    userId: user.uid,
    message: "You have been invited to help manage a home!",
    subject: "Admin Invite",
    date: getTodaysDate(),
    type: "invite",
  };
  return addNotification(notification);
}
