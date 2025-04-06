import * as admin from "firebase-admin";
import { getQueriesForDocumentsAround } from "../utils/meetings";

export const app = admin.initializeApp();

export const ratsFirestore = app.firestore();

// const point = new GeoPoint()
export const meetingCollection = ratsFirestore.collection("meetings");
export const stripeEventCollection = ratsFirestore.collection("stripeEvents");

/**
 * Gets houses where attribute == value
 * @param {*} attribute The attribute to select by
 */
export async function getMeetingsWhere(attribute: string, value: string) {
  return meetingCollection.where(attribute, "==", value).get();
}

export async function getMeetings() {
  return meetingCollection.get();
}

export async function getNaMeetings(
  lat: any,
  lng: any,
  distance: number,
  day?: string
) {
  const queries = getQueriesForDocumentsAround(
    ratsFirestore.collection("na-meetings"),
    { lat, lon: lng },
    10,
    day
  );
  let results = queries.map((q) => q.get());
  const meetings = [];
  results = await Promise.all(results);
  results.forEach((r) => {
    meetings.push(...r.docs.map((d) => d.data()));
  });
  return meetings;
  // if (day) {
  //   return ratsFirestore
  //     .collection('na-meetings')
  //     .where('day', '==', day)
  //     .where('gehoash', '>=', range.lower)
  //     .where('gehoash', '<=', range.upper).get();
  // } else {
  //   return ratsFirestore
  //     .collection('na-meetings')
  //     .where('gehoash', '>=', range.lower)
  //     .where('gehoash', '<=', range.upper).get();
  // }
}
