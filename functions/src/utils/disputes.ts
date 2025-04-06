import {Dispute} from "../entities/Dispute";
import _ from "lodash";
import {getTodaysDate, dateIsInWeek, dayDiff} from "./date";
import {Guest, Activity} from "../entities/Guest";
import Week from "../entities/Week";
import {updateDispute, guestCollection, ratsFirestore} from "../api/firestore";
import {House} from "../entities/House";
import {logger} from "firebase-functions/v1";

// a dispute is successful if it's more than a day old and has not yet been challenged
export const disputeResult = function(dispute: Dispute, activity: Activity): "success" | "fail" | "none" {
  const dateDifference = dayDiff(dispute.initiatedDate, getTodaysDate());
  logger.info("DATE DIFF", dateDifference, dispute);
  //   return dateDifference >= 2 && dispute.active && !(dispute.challenges && dispute.challenges.length);
  let result: "success" | "fail" | "none" = "none";
  if (dateDifference >= 2 && dispute.active) {
    if (dispute.challenges && dispute.challenges.length && dispute.challenges.length >= activity.underDispute) {
      result = "fail";
    } else {
      result = "success";
    }
  }
  return result;
};

const updateHouseDisputes = function(house: House, dispute: Dispute, resolution: "overturned" | "allowed") {
  logger.info("Updating house disputes", house, dispute, resolution);
  dispute.active = false;
  dispute.resolution = resolution;
  const disputes = {id: house.id, disputes: {...house.disputes}};
  const resolvedDispute = _.cloneDeep(disputes.disputes[dispute.id]);
  return {disputes, resolvedDispute};
};

const updateActivity = function(week: Week, dispute: Dispute, result: "success" | "fail") {
  logger.info("Updating guest activity", dispute);
  const index = week.activities.findIndex(
      (activity) => activity.date === dispute.disputeDate && activity.type === dispute.type && activity.underDispute
  );
  const activities = _.cloneDeep(week.activities);
  if (index !== null && index !== undefined && index > -1) {
    activities[index].underDispute = activities[index].underDispute - 1;
    activities[index].disputeResult = result;
  }
  return activities;
};

const reverseGuestStat = function(guest: Guest, week: string, stat: string, value: any, dispute: Dispute): Guest {
  logger.info("Reversing guest stat", guest, stat, value);
  return {
    ...guest,
    [week]: {...guest[week], days: {...guest[week].days, [dispute.disputeDate]: {...guest[week].days[dispute.disputeDate], [stat]: value}}},
  };
};

export const determineDisputeResult = async (house: House, dispute: Dispute, transaction: FirebaseFirestore.Transaction) => {
  logger.info("Determining dispute result...", house, dispute);
  const guestQuery = await transaction.get(guestCollection.where("id", "==", dispute.victimId));
  const guest = guestQuery.docs[0].data() as Guest;
  logger.info("Retrieved victim", guest, "of dispute");
  let victim: Guest;
  const week = dateIsInWeek(dispute.disputeDate, guest.currentWeek.startDate, guest.currentWeek.endDate) ? "currentWeek" : "previousWeek";
  const activity = guest[week].activities.find((a) => a.id === dispute.activityId);
  if (activity) {
    logger.info("ACTIVITY", activity);
    const result = disputeResult(dispute, activity);
    if (result === "success") {
      if (dispute.type === "choreCompleted") {
        victim = reverseGuestStat(guest, week, dispute.type, false, dispute);
      }
      if (dispute.type === "meeting") {
        const meetings = _.cloneDeep(guest[week].days[dispute.disputeDate].meeting);
        const index = meetings.findIndex((m) => m.name === dispute.meetingName);
        meetings.splice(index, 1);
        victim = reverseGuestStat(guest, week, dispute.type, meetings, dispute);
      }
      if (dispute.type === "medication") {
        victim = reverseGuestStat(guest, week, dispute.type, false, dispute);
      }
      if (dispute.type === "metPrimarySupporter") {
        victim = reverseGuestStat(guest, week, dispute.type, false, dispute);
      }
      if (dispute.type === "hoursWorked") {
        victim = reverseGuestStat(guest, week, dispute.type, 0, dispute);
      }
    }
    if (result !== "none") {
      victim[week].activities = updateActivity(victim[week], dispute, result);
      const {disputes, resolvedDispute} = updateHouseDisputes(house, dispute, result === "fail" ? "overturned" : "allowed");
      logger.info("Committing updated disputes to database", disputes, victim);
      updateDispute(disputes, victim, [], transaction, resolvedDispute);
    }
  }
};

export const runDisputeTransaction = (house: House, dispute: Dispute) => {
  return ratsFirestore.runTransaction(async (transaction) => {
    logger.info("Beginning dispute updates for house with id and name", house.id, house.name);
    try {
      return determineDisputeResult(house, dispute, transaction);
    } catch (error) {
      logger.info("Transaction failed for dispute", dispute, error);
      return;
    }
  });
};
