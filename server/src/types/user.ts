export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  recoveryDate?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  notificationSettings: {
    meetings: boolean;
    announcements: boolean;
    celebrations: boolean;
  };
  privacySettings: {
    showRecoveryDate: boolean;
    allowDirectMessages: boolean;
  };
  homeGroups: string[]; // Array of group IDs
  role: "user" | "admin";
}

export interface UserRegistrationData {
  email: string;
  password: string;
  displayName: string;
  recoveryDate?: string;
}

export interface UserUpdateData {
  displayName?: string;
  recoveryDate?: string;
  notificationSettings?: {
    meetings?: boolean;
    announcements?: boolean;
    celebrations?: boolean;
  };
  privacySettings?: {
    showRecoveryDate?: boolean;
    allowDirectMessages?: boolean;
  };
}
