import {EventContext, logger} from "firebase-functions";
import cloneDeep from "lodash/cloneDeep";
import {calculateWeeklyHealth} from "./house";
import {
  guestCollection,
  weeksCollection,
  houseCollection,
  ratsFirestore,
  reportCollection,
} from "../api/firestore";
import {Guest, Guests} from "../entities/Guest";
import {House} from "../entities/House";
import WeeklyReport from "../entities/WeeklyReport";
import {weekIsCurrent} from "./date";
import {startNewWeek} from "./week";
// import { QuerySnapshot } from "@google-cloud/firestore";
const timezones = ["America/New_York", "America/Chicago"];
export const transferStats = async (
    context: EventContext,
    timezone?: string,
    houseId?: string
) => {
  logger.info("Retrieving all houses...");
  let houseQuery: any;
  const guests: Guests = {};
  if (houseId) {
    houseQuery = await houseCollection.where("id", "==", houseId).get();
  } else {
    houseQuery = timezone ?
      await houseCollection.where("timezone", "==", timezone).get() :
      await houseCollection.get();
  }
  logger.info("All houses retrieved. Beginning transaction for each house...");
  for (const doc of houseQuery.docs) {
    if (!houseId && !timezone && doc.data().timezone) {
      continue;
    }
    logger.info("Beginning transaction for house", doc.id);
    try {
      await ratsFirestore.runTransaction(async (transaction) => {
        const house = doc.data() as House;
        logger.info(
            "Beginning weekly transfer transaction for house with id and name",
            house.id,
            house.name
        );
        const guestQuery = await transaction.get(
            guestCollection.where("houseId", "==", house.id)
        );
        // need to get aggregate health from last 8 weeks
        calculateWeeklyHealth(guestQuery, house);
        transaction.update(doc.ref, JSON.parse(JSON.stringify(house)));
        guestQuery.forEach((document) => {
          const guest = document.data() as Guest;
          logger.info("Retrieved guest", guest);
          guests[guest.id] = guest;
          if (guest && !weekIsCurrent(guest.currentWeek)) {
            logger.info("Migrating week...", guest.currentWeek);
            // if there is a previous week, archive it
            if (guest.previousWeek) {
              logger.info("Archiving previous week...", guest.previousWeek);
              const newWeekRef = weeksCollection.doc();
              transaction.set(newWeekRef, guest.previousWeek);
            }
            // the current week should become the previous week
            guest.previousWeek = cloneDeep(guest.currentWeek);
            // create the report for the week
            const weeklyReportDoc = reportCollection.doc();
            const weeklyReport = new WeeklyReport(
                guest.currentWeek,
                weeklyReportDoc.id
            );
            transaction.set(
                weeklyReportDoc,
                JSON.parse(JSON.stringify(weeklyReport))
            );
            // start the week
            startNewWeek(guest);
            // update the guest
            // currently, cloud functions does not support writing to firestore with objects created with custom prototypes (using the new keyword)
            // so we stringify the object and parse it before updating
            if (guest.id) {
              logger.info("Updating guest...", guest.firstName, guest.lastName);
              transaction.update(
                  document.ref,
                  JSON.parse(JSON.stringify(guest))
              );
              logger.info("Guest updated", guest.firstName, guest.lastName);
              guests[guest.id] = guest;
            }
          }
        });
        logger.info(
            "Transaction completed for house with id and name",
            doc.id,
            doc.data().name
        );
      });
    } catch (error) {
      console.error(error);
    }
  }
  logger.info("Weeks started for all houses!");
  return guests;
};
