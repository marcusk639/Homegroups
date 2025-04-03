export interface Meeting {
  id: string;
  groupId: string;
  name: string;
  description?: string;
  day: string;
  time: string;
  duration: number; // In minutes
  location: string;
  address?: string;
  format: string;
  isOnline: boolean;
  onlineLink?: string;
  isRecurring: boolean;
  recurrencePattern?: string; // e.g., "weekly", "monthly"
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
}

export interface MeetingCreationData {
  groupId: string;
  name: string;
  description?: string;
  day: string;
  time: string;
  duration: number;
  location: string;
  address?: string;
  format: string;
  isOnline: boolean;
  onlineLink?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
}

export interface MeetingUpdateData {
  name?: string;
  description?: string;
  day?: string;
  time?: string;
  duration?: number;
  location?: string;
  address?: string;
  format?: string;
  isOnline?: boolean;
  onlineLink?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
}
