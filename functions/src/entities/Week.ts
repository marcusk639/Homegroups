import {BaseEntity} from "./BaseEntity";
import {getStartOfWeek, getEndOfWeek, getWeekdayDate} from "../utils/date";
import {Day} from "./Day";
import {Chore} from "./Chore";
import {Activity, Guest} from "./Guest";

/**
 * Interface for Week entity
 * A Week entity contains a guest's stats for a given week
 */
export default class Week extends BaseEntity {
  id: string;
  houseId = "";
  guestId = "";
  userId = "";
  startDate: string = getStartOfWeek();
  endDate: string = getEndOfWeek();
  primarySupporterId = "";
  primarySupporterName = "";
  sponsees: string[] = [];
  chore: Chore = new Chore();
  activities: Activity[] = [];
  days: any;
  step: number | string = 1;

  constructor(guest: Guest, startDate?: string) {
    super();
    this.startDate = startDate || getStartOfWeek();
    this.endDate = getEndOfWeek(startDate);
    this.houseId = guest.houseId;
    this.guestId = guest.id;
    this.userId = guest.userId;
    this.days = {};
    for (let i = 0; i < 7; i++) {
      this.days[getWeekdayDate(i, startDate)] = new Day(
          getWeekdayDate(i, startDate)
      );
    }
  }
}
