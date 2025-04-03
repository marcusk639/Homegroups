export interface Event {
  id: string;
  groupId: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: number; // In minutes
  location: string;
  address?: string;
  isOnline: boolean;
  onlineLink?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
  attendees?: string[]; // Array of user IDs
}

export interface EventCreationData {
  groupId: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number;
  location: string;
  address?: string;
  isOnline: boolean;
  onlineLink?: string;
}

export interface EventUpdateData {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  duration?: number;
  location?: string;
  address?: string;
  isOnline?: boolean;
  onlineLink?: string;
}
