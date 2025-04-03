export interface Announcement {
  id: string;
  groupId: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
  authorName: string; // Display name
  expiresAt?: Date;
}

export interface AnnouncementCreationData {
  groupId: string;
  title: string;
  content: string;
  isPinned?: boolean;
  expiresAt?: Date;
}

export interface AnnouncementUpdateData {
  title?: string;
  content?: string;
  isPinned?: boolean;
  expiresAt?: Date;
}
