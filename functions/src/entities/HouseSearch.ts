import {Location} from "./GeocodeResponse";

export interface HouseSearch {
  latitude: number;
  longitude: number;
  street: string;
  city: string;
  zipCode: string;
  state: string;
  distance: number;
  filters: HouseSearchFilter;
  place: any;
  houseName: string;
}

export class HouseSearchFilter {
  gender: "male" | "female" | "non-binary" | "all" | "";
  type: "12 Step" | "Faith Based" | "Any";
  location: Location = {lat: null, lng: null};
}
