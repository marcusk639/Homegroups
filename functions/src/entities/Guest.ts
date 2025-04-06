import Week from "./Week";
import {BaseEntity} from "./BaseEntity";
import {Roles} from "./Roles";
import {getTodaysDate, getCurrentTime} from "../utils/date";
import {RatsMeeting} from "./Meeting";
import {v4 as uuid} from "uuid";
import {createGuestId} from "../api/firestore";

export type Stat =
  | "meeting"
  | "medication"
  | "metPrimarySupporter"
  | "hoursWorked"
  | "choreCompleted";
export const stats: Stat[] = [
  "meeting",
  "medication",
  "metPrimarySupporter",
  "hoursWorked",
  "choreCompleted",
];

export type ActivityType =
  | "dispute"
  | "payment"
  | "chore"
  | "meeting"
  | "supporter"
  | "work"
  | "medication"
  | "metPrimarySupporter"
  | "hoursWorked"
  | "choreCompleted"
  | "all"
  | "";

export class Activity {
  type: ActivityType;
  id: string;
  guest: string;
  name: string;
  date: string;
  message: string;
  underDispute = 0;
  disputeResult: "none" | "success" | "fail" = "none";
  meeting?: RatsMeeting;
  disputeId = "";
  createdDate: string;
  jobName: string;
  [key: string]: any;

  constructor(
      guestId: string,
      type: ActivityType,
      name: string,
      message?: string,
      date?: string,
      meeting?: RatsMeeting,
      jobName?: string
  ) {
    this.id = uuid();
    this.guest = guestId;
    this.type = type;
    this.name = name;
    this.date = date || getTodaysDate();
    this.message = message;
    this.meeting = meeting;
    this.createdDate = getCurrentTime();
    this.jobName = jobName;
  }
}

export type Guests = { [guestId: string]: Guest };

export type PartialGuestWithId = Partial<Guest> & { id: string };

/**
 * TODO: UPDATE GUEST SCHEMA
 */
export class Guest extends BaseEntity {
  id = "";
  userId = "";
  houseId = "";
  isAdmin = false;
  rentOwed = 0;
  choreFees = 0;
  dailyHabit = 0;
  drugOfChoice = "";
  email = "";
  firstName = "";
  hasJob = false;
  lastName = "";
  sobrietyDate = "";
  phase: number | string = "default";
  avatar: string;
  supporters: string[] = [];
  roles: Roles;
  currentWeek: Week;
  previousWeek: Week;
  nextWeek: Week;
  phoneNumber: string;
  infoEntered = false;
  jobs = [];
  createdDate = getCurrentTime();

  constructor() {
    super();
    this.id = createGuestId();
    this.currentWeek = new Week(this);
  }
}
