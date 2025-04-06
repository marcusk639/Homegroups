// export interface PhaseConfiguration {
//   name: string;
//   rules: PhaseRule;
// }

// export interface PhaseRule {
//   meetings: number;
//   weekendCurfew: string;
//   weekCurfew: string;
//   nightsOutAllowed: number;
//   supporter: boolean;
//   work: number;
//   chore: boolean;
// }

import moment from "moment";

const defaultCurfew = moment()
    .hour(22)
    .minute(0)
    .format("HH:mm")
    .toString();

export class Curfew {
  required = true;
  times: {
    sunday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
  } = {
      sunday: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
    };

  constructor(defaultTime?: string, weekday?: string, weekend?: string) {
    this.times = {
      sunday: weekday || defaultTime || defaultCurfew,
      monday: weekday || defaultTime || defaultCurfew,
      tuesday: weekday || defaultTime || defaultCurfew,
      wednesday: weekday || defaultTime || defaultCurfew,
      thursday: weekday || defaultTime || defaultCurfew,
      friday: weekend || defaultTime || defaultCurfew,
      saturday: weekend || defaultTime || defaultCurfew,
    };
  }
}

export class PhaseRule {
  meetings = 0;
  curfew?: Curfew = new Curfew();
  nightsOutAllowed = 0;
  supporter = true;
  work = 0;
  chore = true;
  medications = false; // TODO: Implement
}

export const DEFAULT_PHASE = "Default";
export class PhaseConfiguration {
  name: string = DEFAULT_PHASE;
  order = 1;
  rules: PhaseRule = new PhaseRule();
}

export interface Phases {
  [name: string]: PhaseConfiguration;
}

export const defaultPhases: Phases = {[DEFAULT_PHASE]: new PhaseConfiguration()};

export type PhaseConfigType = "basic" | "moderate" | "advanced" | "custom";
