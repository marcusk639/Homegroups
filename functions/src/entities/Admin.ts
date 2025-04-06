import {BaseEntity} from "./BaseEntity";
import {createAdminId} from "../api/firestore";

export default class Admin extends BaseEntity {
  firstName?: string = "";
  lastName?: string = "";
  superAdmin: string[];
  userId = "";
  houseIds: string[] = [];
  avatar?: string;
  phoneNumber: string;
  uniqueAdminAttribute = "admin";
  email = "";

  // static [Symbol.hasInstance](obj) {
  //   if (obj.houseIds) {
  //     return true;
  //   }
  // }

  constructor(email: string, firstName?: string, lastName?: string, userId?: string, superAdmin: string[] = []) {
    super();
    this.firstName = firstName || "";
    this.lastName = lastName || "";
    this.superAdmin = superAdmin;
    this.userId = userId || "";
    this.email = email;
    this.id = createAdminId();
  }
}
