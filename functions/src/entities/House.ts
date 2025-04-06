import {BaseEntity} from "./BaseEntity";
import {Phases, defaultPhases} from "./Phase";
import {defaultChores, Chores} from "./Chore";
import {Dispute} from "./Dispute";
import {createHouseId} from "../api/firestore";

export type PartialHouseWithId = Partial<House> & { id: string };

export interface AwaitingVerification {
  firstName: string;
  lastName: string;
  userId: string;
}

export interface HouseHealth {
  [weekEndDate: string]: number;
}

export type ManagerSetupType = "senior-peer" | "operator-only" | "external-managers" | "democratic";

export const HouseActionItems: HouseActionType[] = ["issues", "applications", "disputes", "complaints"];
export type HouseActionType = "issues" | "applications" | "disputes" | "complaints";

export class House extends BaseEntity {
  id: string = createHouseId();
  timezone = ""; // needed for cloud scheduler function
  superAdminId = "";
  lat: string | number = "";
  lng: string | number = "";
  adminId = "";
  adminIds: string[] = [];
  superAdminIds: string[] = [];
  street = "";
  city = "";
  country = "";
  health: HouseHealth = {};
  name = "";
  monthlyRent = 0;
  weeklyRent = 0;
  currentCapacity = 0;
  maximumCapacity = 1;
  state = "";
  zip = "";
  code = "";
  avatar = "";
  imageUrl = "";
  depositsAndFees: string | number = 0;
  certified = false;
  phoneNumber = "";
  rentFrequency: "weekly" | "monthly" | "both" = "both";
  pendingAdminInvites?: string[] = [];
  pendingGuestInvites?: string[] = [];
  isDemoHouse = false;
  seniorPeerEmails?: string[] = [];
  managerSetupType: ManagerSetupType = "operator-only";
  awaitingVerification: AwaitingVerification[] = [];
  chores: Chores = defaultChores;
  phases: Phases = defaultPhases;
  gender = null;
  disputes: {
    [id: string]: Dispute;
  } = {};
  issues = {};
  applications = {};
  complaints = {};
  rooms = {};
  baths = 1;
  wifi = false;
  rating = 3;
  subscriptionStatus = "";
}
