import * as firestoreUtils from '../utils/firestore';
import {ApiError} from '../middleware/error';
import {STATUS_CODES, ERROR_MESSAGES} from '../utils/constants';
import logger from '../utils/logger';
import {
  TransactionType,
  TransactionCategory,
  Transaction,
  Treasury,
} from '../types/treasury';
import {getGroupById} from './group-service';
import {UserProfile} from '@/types/user';

/**
 * Get all transactions for a group
 */
export const getGroupTransactions = async (
  userId: string,
  groupId: string,
  limit: number = 50,
  startAfter?: string,
) => {
  try {
    // Verify the group exists and user is a member
    await getGroupById(userId, groupId);

    // Build the query
    let query = firestoreUtils
      .colRef(`groups/${groupId}/transactions`)
      .orderBy('date', 'desc')
      .limit(limit);

    // If starting after a specific document
    if (startAfter) {
      const startAfterDoc = await firestoreUtils.getDoc(
        firestoreUtils.docRef(`groups/${groupId}/transactions/${startAfter}`),
      );
      if (startAfterDoc) {
        query = query.startAfter(startAfterDoc);
      }
    }

    // Get transactions
    const transactions = await firestoreUtils.getDocs(query);

    return transactions;
  } catch (error) {
    logger.error(`Error getting group transactions: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Create a new transaction
 */
export const createTransaction = async (
  userId: string,
  groupId: string,
  type: TransactionType,
  amount: number,
  category: TransactionCategory,
  description: string = '',
  date: string,
  receipt: string = '',
) => {
  try {
    // Verify the group exists and user is a member
    const group = await getGroupById(userId, groupId);

    // In a real app, you might want to restrict transaction creation to treasurers or admins

    // Get user display name
    const userDoc = await firestoreUtils.getDoc<UserProfile>(
      firestoreUtils.docRef<UserProfile>(`users/${userId}`),
    );

    if (!userDoc) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Create transaction
    const transactionId = firestoreUtils.generateId();

    const transactionData = {
      id: transactionId,
      type,
      amount,
      category,
      description,
      date,
      receipt: receipt || null,
      createdBy: userId,
      authorName: userDoc.displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await firestoreUtils.setDoc(
      `groups/${groupId}/transactions/${transactionId}`,
      transactionData,
    );

    // Update group treasury overview
    await updateTreasuryOverview(groupId);

    return transactionData;
  } catch (error) {
    logger.error(`Error creating transaction: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Update a transaction
 */
export const updateTransaction = async (
  userId: string,
  groupId: string,
  transactionId: string,
  type?: TransactionType,
  amount?: number,
  category?: TransactionCategory,
  description?: string,
  date?: string,
  receipt?: string,
) => {
  try {
    // Verify the group exists and user is a member
    const group = await getGroupById(userId, groupId);

    const transaction = await firestoreUtils.getDocById<Transaction>(
      `groups/${groupId}/transactions`,
      transactionId,
    );

    if (!transaction) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
      );
    }

    // Only creator or group admin can update
    if (transaction.createdBy !== userId && !group.isAdmin) {
      throw new ApiError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
    }

    // Prepare update data
    const updateData: any = {updatedAt: new Date()};

    if (type !== undefined) updateData.type = type;
    if (amount !== undefined) updateData.amount = amount;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = date;
    if (receipt !== undefined) updateData.receipt = receipt;

    // Update the transaction
    await firestoreUtils.updateDoc(
      `groups/${groupId}/transactions/${transactionId}`,
      updateData,
    );

    // Update group treasury overview
    await updateTreasuryOverview(groupId);

    // Get the updated transaction
    return await firestoreUtils.getDocById<Transaction>(
      `groups/${groupId}/transactions`,
      transactionId,
    );
  } catch (error) {
    logger.error(`Error updating transaction: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (
  userId: string,
  groupId: string,
  transactionId: string,
) => {
  try {
    // Verify the group exists and user is a member
    const group = await getGroupById(userId, groupId);

    // Get the transaction
    const transaction = await firestoreUtils.getDocById<Transaction>(
      `groups/${groupId}/transactions`,
      transactionId,
    );

    if (!transaction) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
      );
    }

    // Only creator or group admin can delete
    if (transaction.createdBy !== userId && !group.isAdmin) {
      throw new ApiError(STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
    }

    // Delete the transaction
    await firestoreUtils.deleteDoc(
      `groups/${groupId}/transactions/${transactionId}`,
    );

    // Update group treasury overview
    await updateTreasuryOverview(groupId);

    return {success: true};
  } catch (error) {
    logger.error(`Error deleting transaction: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Get treasury overview for a group
 */
export const getTreasuryOverview = async (userId: string, groupId: string) => {
  try {
    // Verify the group exists and user is a member
    await getGroupById(userId, groupId);

    // Get treasury overview document
    const overview = await firestoreUtils.getDocById<Treasury>(
      `groups/${groupId}/treasury/overview`,
      'overview',
    );

    if (!overview) {
      // If no overview exists yet, calculate and create it
      return await updateTreasuryOverview(groupId);
    }

    return overview;
  } catch (error) {
    logger.error(`Error getting treasury overview: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Update the treasury overview for a group
 * This is called after any transaction is created, updated, or deleted
 */
export const updateTreasuryOverview = async (groupId: string) => {
  try {
    // Get all transactions for the group
    const transactions = await firestoreUtils.getCollection<Transaction>(
      `groups/${groupId}/transactions`,
    );

    // Calculate balance
    let balance = 0;

    for (const transaction of transactions) {
      if (transaction.type === 'income') {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
    }

    // Calculate monthly income and expenses
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    for (const transaction of transactions) {
      const transactionDate = new Date(transaction.date);

      if (transactionDate >= firstDayOfMonth) {
        if (transaction.type === 'income') {
          monthlyIncome += transaction.amount;
        } else {
          monthlyExpenses += transaction.amount;
        }
      }
    }

    const treasuryDoc = await firestoreUtils.getDoc<Treasury>(
      firestoreUtils.docRef<Treasury>(`groups/${groupId}/treasury`),
    );
    const prudentReserve = treasuryDoc?.prudentReserve || 0;

    // Calculate available funds
    const availableFunds = balance - prudentReserve;

    // Create or update overview document
    const overviewData = {
      balance,
      monthlyIncome,
      monthlyExpenses,
      prudentReserve,
      availableFunds,
      lastUpdated: new Date(),
    };

    await firestoreUtils.setDoc(
      `groups/${groupId}/treasury/overview`,
      overviewData,
      true,
    );

    return overviewData;
  } catch (error) {
    logger.error(`Error updating treasury overview: ${error}`);
    throw error;
  }
};

/**
 * Set prudent reserve amount for a group
 */
export const setPrudentReserve = async (
  userId: string,
  groupId: string,
  amount: number,
) => {
  try {
    // Verify the group exists and user is an admin
    const group = await getGroupById(userId, groupId);

    if (!group.isAdmin) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        ERROR_MESSAGES.NOT_GROUP_ADMIN,
      );
    }

    // Update the group document
    await firestoreUtils.updateDoc(`groups/${groupId}`, {
      prudentReserve: amount,
      updatedAt: new Date(),
    });

    // Update treasury overview
    await updateTreasuryOverview(groupId);

    return await getTreasuryOverview(userId, groupId);
  } catch (error) {
    logger.error(`Error setting prudent reserve: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Get transaction summary by category
 */
export const getTransactionSummaryByCategory = async (
  userId: string,
  groupId: string,
  type: TransactionType,
  startDate?: string,
  endDate?: string,
) => {
  try {
    // Verify the group exists and user is a member
    await getGroupById(userId, groupId);

    // Get transactions filtered by type and date range
    let query = firestoreUtils
      .colRef<Transaction>(`groups/${groupId}/transactions`)
      .where('type', '==', type);

    if (startDate) {
      query = query.where('date', '>=', startDate);
    }

    if (endDate) {
      query = query.where('date', '<=', endDate);
    }

    const transactions = await firestoreUtils.getDocs<Transaction>(query);

    // Group by category and sum amounts
    const summary: Record<string, number> = {};

    for (const transaction of transactions) {
      const category = transaction.category;
      const amount = transaction.amount;

      if (!summary[category]) {
        summary[category] = 0;
      }

      summary[category] += amount;
    }

    // Convert to array for easier consumption
    const result = Object.entries(summary).map(([category, amount]) => ({
      category,
      amount,
    }));

    // Sort by amount (descending)
    return result.sort((a, b) => b.amount - a.amount);
  } catch (error) {
    logger.error(`Error getting transaction summary: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Get monthly transaction summary
 */
export const getMonthlyTransactionSummary = async (
  userId: string,
  groupId: string,
  months: number = 12,
) => {
  try {
    // Verify the group exists and user is a member
    await getGroupById(userId, groupId);

    // Calculate date range
    const now = new Date();
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - months + 1,
      1,
    );
    const startDateString = startDate.toISOString().split('T')[0];

    // Get transactions in date range
    const transactions = await firestoreUtils.getDocs<Transaction>(
      firestoreUtils
        .colRef<Transaction>(`groups/${groupId}/transactions`)
        .where('date', '>=', startDateString)
        .orderBy('date', 'asc'),
    );

    // Group by month and type, sum amounts
    const summary: Record<
      string,
      {
        month: string;
        income: number;
        expense: number;
        balance: number;
      }
    > = {};

    for (const transaction of transactions) {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}`;
      const type = transaction.type;
      const amount = transaction.amount;

      if (!summary[monthKey]) {
        summary[monthKey] = {
          month: monthKey,
          income: 0,
          expense: 0,
          balance: 0,
        };
      }

      if (type === 'income') {
        summary[monthKey].income += amount;
      } else {
        summary[monthKey].expense += amount;
      }
    }

    // Fill in missing months and calculate balances
    const result = [];
    let runningBalance = 0;

    for (let i = 0; i < months; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${monthDate.getFullYear()}-${String(
        monthDate.getMonth() + 1,
      ).padStart(2, '0')}`;
      const monthName = monthDate.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });

      const monthData = summary[monthKey] || {
        month: monthKey,
        income: 0,
        expense: 0,
      };

      runningBalance += monthData.income - monthData.expense;
      monthData.balance = runningBalance;
      monthData.month = monthName;

      result.unshift(monthData); // Add to beginning to maintain chronological order
    }

    return result;
  } catch (error) {
    logger.error(`Error getting monthly transaction summary: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    );
  }
};
