import {BaseEntity} from "./BaseEntity";
import Week from "./Week";
import {sumStat} from "../utils/week";

class WeeklyReport extends BaseEntity {
  guestId: string;
  startDate: string;
  endDate: string;
  hoursWorked: number | string;
  step: number | string;
  medication: number | string;
  choreCompleted: number | string;
  metPrimarySupporter: boolean;
  meeting: number | string;

  constructor(week: Week, id: string) {
    super();
    this.id = id;
    this.guestId = week.guestId;
    this.startDate = week.startDate;
    this.endDate = week.endDate;
    this.hoursWorked = sumStat(week, "hoursWorked");
    this.medication = sumStat(week, "medication");
    this.meeting = sumStat(week, "meeting");
    this.metPrimarySupporter =
      sumStat(week, "metPrimarySupporter") > 0 ? true : false;
    this.choreCompleted = sumStat(week, "choreCompleted");
  }
}

export default WeeklyReport;
