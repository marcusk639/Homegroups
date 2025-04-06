import {getUsersByEmail} from "./user";
import {createInviteNotification} from "./notifications";
import {User} from "../entities/User";
import {InviteEmailPayload} from "../entities/Email";

export async function notifyAdminsIfTheyExist(adminEmails: string[], inviteEmails: InviteEmailPayload[]) {
  const promises: Promise<any>[] = [];
  try {
    for (let i = 0; i < adminEmails.length; i++) {
      const user = await getUsersByEmail(adminEmails[i]);
      if (user.docs && user.docs.length && user.docs[0].exists) {
        promises.push(
            createInviteNotification(
            user.docs[0].data() as User,
            inviteEmails.find((email) => email.email.to.toLowerCase() === adminEmails[i].toLowerCase())
            )
        );
      }
    }
  } catch (error) {
    // continue
  }
  return Promise.all(promises);
}
