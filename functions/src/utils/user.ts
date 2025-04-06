import {getUsers} from "../api/firestore";
import {Guest} from "../entities/Guest";
import {User} from "../entities/User";
import {auth} from "firebase-admin";
import {regroupEmail} from "./email";
import {Email} from "../entities/Email";

export async function getUsersByEmail(email: string) {
  return getUsers("email", email.toLowerCase());
}

export async function getGuestsAsUsers(guests: Guest[]) {
  const userPromises: Promise<FirebaseFirestore.QuerySnapshot>[] = guests.map((guest) => getUsers("uid", guest.userId));
  const users: User[] = [];
  for (let i = 0; i < userPromises.length; i++) {
    const promise = userPromises[i];
    const user = await promise;
    users.push(user.docs[0].data() as User);
  }
  return users;
}

export async function _verifyUserEmail(userId: string) {
  return auth().updateUser(userId, {emailVerified: true});
}

export function createConfirmationEmail(email: string, dynamicLink, name?: string): Email {
  const header = name ? `Hello ${name},\n\n` : "Hello,\n\n";
  const body =
    `Follow this link to verify your email address.\n\n
   ${decodeURIComponent(dynamicLink)}\n\n
   If you didn't create an account with this address, you can ignore this email.\n\n
   Thanks,\n\n
   Your Regroup: Sober Living App team`;
  return {
    text: `${header}${body}`,
    to: email,
    from: `"Regroup LLC" ${regroupEmail}`,
    subject: "Email Confirmation",
  };
}
