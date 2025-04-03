export interface Meeting {
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

export interface MeetingCreationData {
  groupId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  address?: string;
  isOnline: boolean;
  onlineLink?: string;
}

export interface MeetingUpdateData {
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
