import {Guest} from "../entities/Guest";
import Week from "../entities/Week";
import each from "lodash/each";

export const startNewWeek = (guest: Guest) => {
  const newWeek = new Week(guest);
  guest.currentWeek = newWeek;
  guest.currentWeek.guestId = guest.id;
  guest.currentWeek.houseId = guest.houseId;
  if (guest.previousWeek) {
    guest.currentWeek.primarySupporterId =
      guest.previousWeek.primarySupporterId;
    guest.currentWeek.primarySupporterName =
      guest.previousWeek.primarySupporterName;
    guest.currentWeek.sponsees = guest.previousWeek.sponsees;
    guest.currentWeek.step = guest.previousWeek.step;
  }
  guest.currentWeek.userId = guest.userId;
};

export const sumStat = (week: Week, stat: string) => {
  let count = 0;
  each(week.days, (day) => {
    if (Array.isArray(day[stat])) {
      count += day[stat].length;
    } else if (typeof day[stat] === "boolean") {
      count += day[stat] ? 1 : 0;
    } else if (typeof day[stat] === "object") {
      Object.getOwnPropertyNames(day[stat]).forEach((key) => {
        if (day[stat][key]) {
          count += day[stat][key];
        }
      });
    } else {
      count += day[stat];
    }
  });
  return count;
};
