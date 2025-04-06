export class Meeting {
  name: string = '';
  time: string = '';
  street: string = '';
  city?: string;
  state?: string;
  zip?: string;
  types?: string[];
  lat?: number;
  lng?: number;
  locationName?: string; // or the directions, if NA meeting
  type?: MeetingType;
  Location?: string[]; // specific to NA meetings
  day?: string;
  online?: boolean;
  link?: string;
  onlineNotes?: string;
  daysAndTimes?: DaysAndTimes = new DaysAndTimes();
}

export class DaysAndTimes {
  sunday: string = '';
  monday: string = '';
  tuesday: string = '';
  wednesday: string = '';
  thursday: string = '';
  friday: string = '';
  saturday: string = '';
}

export type MeetingType =
  | 'AA'
  | 'NA'
  | 'IOP'
  | 'Religious'
  | 'Celebrate Recovery'
  | 'CUSTOM';

export interface Location {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  street?: string;
  zip?: string;
}

export interface MeetingSearchCriteria {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  time?: string;
  location?: Location;
}

export interface MeetingSearchInput {
  location?: Location; // should default to user location, fall back to house location, or use custom input locationB
  filters?: MeetingFilters;
  criteria?: MeetingSearchCriteria;
}

export class MeetingFilters {
  day?: keyof DaysAndTimes;
  location?: Location;
  type?: MeetingType;
}
