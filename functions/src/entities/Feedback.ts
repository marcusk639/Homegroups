import {BaseEntity} from "./BaseEntity";

export class Feedback extends BaseEntity {
  description = "";
  reviewer = ""; // user id of the giver of feedback
  type: "house" | "app";
  houseId: string;
}
