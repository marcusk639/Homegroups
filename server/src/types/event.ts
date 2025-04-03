export interface Event {
  id: string;
  groupId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  address: string | null;
  isOnline: boolean;
  onlineLink: string | null;
  attendees: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCreationData {
  groupId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  address?: string | null;
  isOnline: boolean;
  onlineLink?: string | null;
}

export interface EventUpdateData {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  duration?: number;
  location?: string;
  address?: string | null;
  isOnline?: boolean;
  onlineLink?: string | null;
}
