export interface GroupMember {
  uid: string;
  displayName: string;
  recoveryDate?: string;
  joinedAt: Date;
  position?: string; // Secretary, treasurer, etc.
  isAdmin: boolean;
  updatedAt?: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  meetingDay: string;
  meetingTime: string;
  location: string;
  address?: string;
  format: string;
  isOnline: boolean;
  onlineLink?: string;
  createdAt: Date;
  updatedAt: Date;
  foundedDate?: string;
  members: GroupMember[];
  memberCount: number;
  admins: string[]; // Array of user IDs
  isAdmin?: boolean; // Computed property for the current user
}

export interface GroupCreationData {
  name: string;
  description: string;
  meetingDay: string;
  meetingTime: string;
  location: string;
  address?: string;
  format: string;
  isOnline: boolean;
  onlineLink?: string;
  foundedDate?: string;
}

export interface GroupUpdateData {
  name?: string;
  description?: string;
  meetingDay?: string;
  meetingTime?: string;
  location?: string;
  address?: string;
  format?: string;
  isOnline?: boolean;
  onlineLink?: string;
  foundedDate?: string;
}
