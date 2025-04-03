import {z} from 'zod';

export interface Announcement {
  id: string;
  groupId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// Validation schemas
export const announcementIdSchema = z
  .string()
  .min(1, 'Announcement ID is required');

export const announcementCreationSchema = z.object({
  groupId: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
  isPinned: z.boolean().optional(),
});

export const announcementUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  isPinned: z.boolean().optional(),
});

export const announcementPaginationSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val) : 20)),
  startAfter: z.string().optional(),
});

export const announcementAuthorSchema = z.object({
  authorId: z.string().min(1, 'Author ID is required'),
  authorName: z.string().min(1, 'Author name is required'),
});

export type AnnouncementCreationData = z.infer<
  typeof announcementCreationSchema
>;
export type AnnouncementUpdateData = z.infer<typeof announcementUpdateSchema>;
export type AnnouncementPaginationData = z.infer<
  typeof announcementPaginationSchema
>;
export type AnnouncementAuthorData = z.infer<typeof announcementAuthorSchema>;
