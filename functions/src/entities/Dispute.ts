import {ActivityType} from "./Guest";

export type DisputeType = ActivityType;
export const DISPUTABLE_STATS = ["choreCompleted", "metPrimarySupporter", "hoursWorked", "meeting", "medication"];

export class DisputeChallenge {
  challenger: string;
  message: string;
}

export class Dispute {
  id = "";
  activityId: string;
  type: ActivityType = "";
  disputerIds: string[] = []; // guest id
  victimId = ""; // guest id
  active = true;
  challenges: DisputeChallenge[];
  messages: string[] = [];
  resolution?: "overturned" | "allowed" | "";
  count = 0;
  initiatedDate = "";
  disputeDate = "";
  meetingStreet = "";
  meetingName = "";
  disputerName = "";
  victimName = "";
}
// import { ActivityType } from './Guest';

// export type DisputeType = ActivityType;
// export const DISPUTABLE_STATS = ['choreCompleted', 'metPrimarySupporter', 'hoursWorked', 'meeting', 'medication'];

// export class DisputeChallenge {
//   challenger: string;
//   message: string;
// }

// export class Dispute {
//   id: string = '';
//   activityId: string;
//   type: ActivityType = '';
//   disputerIds: string[] = []; // guest id
//   victimId: string = ''; // guest id
//   active: boolean = true;
//   challenges: DisputeChallenge[];
//   messages: string[] = [];
//   count: number = 0;
//   resolution?: string;
//   initiatedDate: string = '';
//   disputeDate: string = '';
//   meetingStreet: string = '';
//   meetingName: string = '';
//   victimName: string = '';
// }
