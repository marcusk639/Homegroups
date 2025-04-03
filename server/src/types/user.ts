import { z } from "zod";

export interface UserRegistrationData {
  email: string;
  password: string;
  displayName: string;
  recoveryDate?: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  recoveryDate?: Date;
  homeGroups: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  uid: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  privacySettings: {
    showRecoveryDate: boolean;
    showHomeGroups: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Validation schemas
export const updateProfileSchema = z.object({
  displayName: z.string().min(2).optional(),
  photoURL: z.string().url().optional(),
  recoveryDate: z.string().datetime().optional(),
});

export const updateSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  privacySettings: z
    .object({
      showRecoveryDate: z.boolean().optional(),
      showHomeGroups: z.boolean().optional(),
    })
    .optional(),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type UpdateSettingsData = z.infer<typeof updateSettingsSchema>;
