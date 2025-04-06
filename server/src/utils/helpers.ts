import jwt from "jsonwebtoken";
import { UnitAnyCase } from "ms";
import { DecodedToken } from "../types/auth";

/**
 * Generate JWT token for user authentication
 *
 * @param {string} uid - User ID
 * @param {string} email - User email
 * @param {string} role - User role (user/admin)
 * @returns {string} JWT token
 */
export const generateToken = (
  uid: string,
  email: string,
  role: string
): string => {
  const secret = process.env.JWT_SECRET || "your-secret-key-change-this-asap";
  const expiresIn =
    (process.env.JWT_EXPIRES_IN as `${number}${UnitAnyCase}`) || "7D";
  return jwt.sign({ uid, email, role }, secret, { expiresIn });
};

/**
 * Verify and decode JWT token
 *
 * @param {string} token - JWT token to verify
 * @returns {DecodedToken | null} Decoded token data or null if invalid
 */
export const verifyToken = (token: string): DecodedToken | null => {
  try {
    const secret = process.env.JWT_SECRET || "your-secret-key-change-this-asap";
    return jwt.verify(token, secret) as DecodedToken;
  } catch (error) {
    return null;
  }
};

/**
 * Format a date in YYYY-MM-DD format
 *
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Calculate sobriety time in years, months, and days
 *
 * @param {string} sobrietyDate - Sobriety date in YYYY-MM-DD format
 * @returns {object} Object containing years, months, and days
 */
export const calculateSobrietyTime = (
  sobrietyDate: string
): { years: number; months: number; days: number } => {
  const start = new Date(sobrietyDate);
  const today = new Date();

  // Calculate difference in milliseconds
  const diffInMs = today.getTime() - start.getTime();

  // Convert to days
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Calculate years, months, days
  const years = Math.floor(diffInDays / 365);
  const months = Math.floor((diffInDays % 365) / 30);
  const days = diffInDays % 30;

  return { years, months, days };
};

/**
 * Format currency as USD
 *
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Generate a random ID
 *
 * @param {number} length - Length of the ID
 * @returns {string} Random ID
 */
export const generateId = (length: number = 20): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

/**
 * Validate email format
 *
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Create pagination parameters from request query
 *
 * @param query - Request query object
 * @returns Pagination parameters
 */
export const getPaginationParams = (
  query: any
): { page: number; limit: number; skip: number } => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Calculate the total balance from an array of transactions
 *
 * @param transactions - Array of transactions
 * @returns Total balance
 */
export const calculateBalance = (transactions: any[]): number => {
  return transactions.reduce((balance, transaction) => {
    if (transaction.type === "income") {
      return balance + transaction.amount;
    } else {
      return balance - transaction.amount;
    }
  }, 0);
};
