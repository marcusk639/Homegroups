import {BaseEntity} from "./BaseEntity";
import {Dispute} from "./Dispute";

export type NotificationLevel = "notice" | "warning" | "alert";

export type NotificationType = "dispute" | "invite" | "";

export class Notification extends BaseEntity {
  userId = "";
  guestId?: string = "";
  adminId?: string = "";
  superAdminId?: string = "";
  message?: string = "";
  subject?: string = "";
  date?: string = "";
  type: NotificationType = "";
}

export class DisputeNotification extends Notification {
  level?: NotificationLevel = "alert";
  dispute: Dispute;

  constructor(dispute: Dispute, date: string, subject: string, message: string, userId: string) {
    super();
    this.dispute = dispute;
    this.date = date;
    this.subject = subject;
    this.message = message;
    this.userId = userId;
    this.type = "dispute";
  }
}
