import {RatsMeeting} from "./Meeting";

interface HoursWorked {
  [jobName: string]: number;
}

export class Day {
  date: string;
  choreCompleted = false;
  hoursWorked: HoursWorked = {};
  metPrimarySupporter = false;
  meeting: RatsMeeting[] = [];
  medication = false;

  static isDay(arg: any): arg is Day {
    return arg.choreCompleted !== undefined;
  }

  constructor(date: string) {
    this.date = date;
  }
}
