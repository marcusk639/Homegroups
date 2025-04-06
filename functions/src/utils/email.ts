import * as functions from "firebase-functions";
import get from "lodash/get";
import {Email} from "../entities/Email";
import sendgrid from "@sendgrid/mail";
import {logger} from "firebase-functions/v1";

export const regroupEmail = "admin@regroup-app.com";
const API_KEY = get(functions.config(), "sendgrid.key", "");
sendgrid.setApiKey(API_KEY);

/**
 * Sends an email
 * @param email
 */
export const sendEmail = async (email: Email) => {
  try {
    await sendgrid.send({
      to: email.to,
      from: email.from || regroupEmail,
      text: email.text,
      subject: email.subject,
    });
  } catch (error) {
    logger.info("There was an error sending the email:", JSON.stringify(error));
  }
};
