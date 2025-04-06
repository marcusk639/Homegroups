import {BaseEntity} from "./BaseEntity";

export class BugReport extends BaseEntity {
  description = "";
  reporter = ""; // user id of the bug reporter
}
