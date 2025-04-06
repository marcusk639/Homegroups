import * as functions from "firebase-functions";
import {getNarcoticsAnoymousMeetings, getAll12StepMeetings, getCustomMeetings, getAlcoholicsAnonymousMeetings} from "./utils/meetings";
import {Meeting, MeetingSearchCriteria} from "./entities/Meeting";
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
/**
 * Retrieves all meetings based on the location and filters sent in the request
 * data: {
 *  location: { lat, lng }
 *  filters: type of meeting (AA, NA, etc)
 * }
 */
interface MeetingSearchInput {
  filters: {
    date: string;
    location: {
      lat: number;
      lng: number;
    };
    day: string;
    type: MeetingTypeFilters;
  };

  criteria?: MeetingSearchCriteria;
}

export type MeetingTypeFilters =
  | "AA"
  | "NA"
  | "AL-ANON"
  | "Religious"
  | "Custom"
  | "all"
  | "Celebrate Recovery";

export const findMeetings = functions.https.onCall(
    async (data: MeetingSearchInput, context) => {
      const meetingPromises: Promise<Meeting[]>[] = [];
      const start = Date.now();
      try {
        functions.logger.info("FIND MEETING Filters", data.filters);
        if (data.filters && data.filters.type && data.filters.type !== "all") {
          if (data.filters.type === "AA") {
            const aaMeetings = getAlcoholicsAnonymousMeetings(
                data.filters.location,
                data.criteria
            );
            meetingPromises.push(aaMeetings);
          }
          if (data.filters.type === "NA") {
            const naMeetings = getNarcoticsAnoymousMeetings(
                data.filters.location,
                data.criteria,
                data.filters.day
            );
            meetingPromises.push(naMeetings);
          }
          if (data.filters.type === "Custom") {
            const customMeetings = getCustomMeetings(
                data.filters.location,
                data.criteria
            );
            meetingPromises.push(customMeetings);
          }
        } else {
          const all12StepMeetings = getAll12StepMeetings(
              data.filters.location,
              data.criteria,
              data.filters.day
          );
          meetingPromises.push(all12StepMeetings);
        }
      } catch (error) {
        functions.logger.info("SOMETHING WENT WRONG", error);
      }
      const results = await Promise.all(meetingPromises);
      const meetings: Meeting[] = [];
      for (const meetingSet of results) {
        meetings.push(...meetingSet);
      }
      const end = Date.now();
      functions.logger.info(
          "Meeting retrieval took",
          (end - start) / 1000,
          "seconds"
      );
      return meetings;
    }
);
