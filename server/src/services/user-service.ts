import { auth } from "../config/firebase";
import * as firestoreUtils from "../utils/firestore";
import { UserUpdateData } from "../types/user";
import { ApiError } from "../middleware/error";
import { STATUS_CODES, ERROR_MESSAGES } from "../utils/constants";
import logger from "../utils/logger";

/**
 * Get user profile data
 */
export const getUserProfile = async (uid: string) => {
  try {
    const userData = await firestoreUtils.getDoc(
      firestoreUtils.docRef(`users/${uid}`)
    );

    if (!userData) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return userData;
  } catch (error) {
    logger.error(`Error getting user profile: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
  }
};

/**
 * Update user profile data
 */
export const updateUserProfile = async (
  uid: string,
  userData: UserUpdateData
) => {
  try {
    // Verify user exists
    const userExists = await firestoreUtils.docExists(`users/${uid}`);

    if (!userExists) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Update display name in Firebase Auth if included
    if (userData.displayName) {
      await auth.updateUser(uid, { displayName: userData.displayName });
    }

    // Update user document in Firestore
    await firestoreUtils.updateDoc(`users/${uid}`, userData);

    // Fetch and return updated user data
    return await firestoreUtils.getDoc(firestoreUtils.docRef(`users/${uid}`));
  } catch (error) {
    logger.error(`Error updating user profile: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get all groups a user is a member of
 */
export const getUserGroups = async (uid: string) => {
  try {
    // Get user data to get group IDs
    const userData = await getUserProfile(uid);

    if (!userData.homeGroups || userData.homeGroups.length === 0) {
      return [];
    }

    // Get details for each group
    const groups = [];

    for (const groupId of userData.homeGroups) {
      const groupData = await firestoreUtils.getDoc(
        firestoreUtils.docRef(`groups/${groupId}`)
      );

      if (groupData) {
        // Check if user is an admin of this group
        const isAdmin = groupData.admins && groupData.admins.includes(uid);

        groups.push({
          ...groupData,
          isAdmin,
        });
      }
    }

    return groups;
  } catch (error) {
    logger.error(`Error getting user groups: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get user's upcoming meetings
 */
export const getUserMeetings = async (uid: string) => {
  try {
    // First get all the user's groups
    const userData = await getUserProfile(uid);

    if (!userData.homeGroups || userData.homeGroups.length === 0) {
      return [];
    }

    // Then get meetings for each group
    // For a real app, you would query the meetings collection directly
    // and filter by the user's group IDs
    const meetings = [];

    for (const groupId of userData.homeGroups) {
      // Get the group data to display names
      const groupData = await firestoreUtils.getDoc(
        firestoreUtils.docRef(`groups/${groupId}`)
      );

      if (groupData) {
        // Get 3 upcoming meetings for this group
        // This is a simplified example - in a real app, you'd have a more complex query
        const upcomingMeetings = [];
        upcomingMeetings.push({
          id: `meeting-${groupId}-1`,
          name: groupData.name,
          dayOfWeek: "Today",
          time: groupData.meetingTime,
          location: groupData.location,
          format: groupData.format,
        });

        meetings.push(...upcomingMeetings);
      }
    }

    return meetings;
  } catch (error) {
    logger.error(`Error getting user meetings: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Add a user to a group
 */
export const addUserToGroup = async (uid: string, groupId: string) => {
  try {
    // Make sure the group exists
    const groupExists = await firestoreUtils.docExists(`groups/${groupId}`);

    if (!groupExists) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.GROUP_NOT_FOUND
      );
    }

    // Get user data
    const userData = await getUserProfile(uid);

    // Check if user is already in the group
    if (userData.homeGroups && userData.homeGroups.includes(groupId)) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        ERROR_MESSAGES.USER_ALREADY_IN_GROUP
      );
    }

    // Run in a transaction to ensure consistency
    await firestoreUtils.runTransaction(async (transaction) => {
      // Get group data
      const groupDoc = await transaction.get(
        firestoreUtils.docRef(`groups/${groupId}`)
      );
      const groupData = groupDoc.data();

      if (!groupData) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          ERROR_MESSAGES.GROUP_NOT_FOUND
        );
      }

      // Update user's homeGroups array
      let homeGroups = userData.homeGroups || [];
      homeGroups.push(groupId);

      transaction.update(firestoreUtils.docRef(`users/${uid}`), {
        homeGroups,
        updatedAt: new Date(),
      });

      // Add user to group members subcollection
      transaction.set(
        firestoreUtils.docRef(`groups/${groupId}/members/${uid}`),
        {
          uid,
          displayName: userData.displayName,
          recoveryDate: userData.recoveryDate || null,
          joinedAt: new Date(),
          isAdmin: false,
        }
      );

      // Update group's memberCount
      const newMemberCount = (groupData.memberCount || 0) + 1;
      transaction.update(firestoreUtils.docRef(`groups/${groupId}`), {
        memberCount: newMemberCount,
        updatedAt: new Date(),
      });
    });

    return { success: true };
  } catch (error) {
    logger.error(`Error adding user to group: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Remove a user from a group
 */
export const removeUserFromGroup = async (uid: string, groupId: string) => {
  try {
    // Get user data
    const userData = await getUserProfile(uid);

    // Check if user is in the group
    if (!userData.homeGroups || !userData.homeGroups.includes(groupId)) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        ERROR_MESSAGES.USER_NOT_IN_GROUP
      );
    }

    // Run in a transaction to ensure consistency
    await firestoreUtils.runTransaction(async (transaction) => {
      // Get group data
      const groupDoc = await transaction.get(
        firestoreUtils.docRef(`groups/${groupId}`)
      );
      const groupData = groupDoc.data();

      if (!groupData) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          ERROR_MESSAGES.GROUP_NOT_FOUND
        );
      }

      // Check if user is an admin
      const memberDoc = await transaction.get(
        firestoreUtils.docRef(`groups/${groupId}/members/${uid}`)
      );
      const memberData = memberDoc.data();

      if (memberData && memberData.isAdmin) {
        // Check if this is the last admin
        const adminsQuery = await firestoreUtils.getDocs(
          firestoreUtils
            .colRef(`groups/${groupId}/members`)
            .where("isAdmin", "==", true)
        );

        if (adminsQuery.length <= 1) {
          throw new ApiError(
            STATUS_CODES.BAD_REQUEST,
            ERROR_MESSAGES.CANNOT_REMOVE_LAST_ADMIN
          );
        }
      }

      // Update user's homeGroups array
      const homeGroups = userData.homeGroups.filter((id) => id !== groupId);

      transaction.update(firestoreUtils.docRef(`users/${uid}`), {
        homeGroups,
        updatedAt: new Date(),
      });

      // Remove user from group members subcollection
      transaction.delete(
        firestoreUtils.docRef(`groups/${groupId}/members/${uid}`)
      );

      // Update group's memberCount
      const newMemberCount = Math.max((groupData.memberCount || 0) - 1, 0);
      transaction.update(firestoreUtils.docRef(`groups/${groupId}`), {
        memberCount: newMemberCount,
        updatedAt: new Date(),
      });

      // If user was an admin, remove from admins array
      if (memberData && memberData.isAdmin && groupData.admins) {
        const admins = groupData.admins.filter((adminId) => adminId !== uid);
        transaction.update(firestoreUtils.docRef(`groups/${groupId}`), {
          admins,
          updatedAt: new Date(),
        });
      }
    });

    return { success: true };
  } catch (error) {
    logger.error(`Error removing user from group: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get a user's upcoming celebrations (sobriety milestones)
 */
export const getUserCelebrations = async (uid: string) => {
  try {
    // Get user's groups
    const userData = await getUserProfile(uid);

    if (!userData.homeGroups || userData.homeGroups.length === 0) {
      return [];
    }

    // Query the celebrations collection for this user's groups
    // This is a simplified example - in a real app, you'd query Firestore directly
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    const celebrations = [];

    // Simulate getting celebrations
    // In a production app, you would perform an actual Firestore query
    if (userData.recoveryDate) {
      const recoveryDate = new Date(userData.recoveryDate);
      const nextAnniversary = new Date(recoveryDate);
      nextAnniversary.setFullYear(today.getFullYear());

      if (nextAnniversary < today) {
        nextAnniversary.setFullYear(today.getFullYear() + 1);
      }

      if (nextAnniversary <= threeMonthsFromNow) {
        const years =
          nextAnniversary.getFullYear() - recoveryDate.getFullYear();

        celebrations.push({
          id: `celebration-${uid}`,
          memberName: userData.displayName,
          years,
          celebrationDate: nextAnniversary,
        });
      }
    }

    return celebrations;
  } catch (error) {
    logger.error(`Error getting user celebrations: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    );
  }
};
