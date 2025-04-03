// Status codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Success messages
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: "User registered successfully",
  USER_LOGGED_IN: "User logged in successfully",
  USER_LOGGED_OUT: "User logged out successfully",
  PASSWORD_RESET: "Password reset email sent",
  PASSWORD_UPDATED: "Password updated successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  GROUP_CREATED: "Group created successfully",
  GROUP_UPDATED: "Group updated successfully",
  GROUP_DELETED: "Group deleted successfully",
  MEMBER_ADDED: "Member added to group successfully",
  MEMBER_REMOVED: "Member removed from group successfully",
  MEMBER_ROLE_UPDATED: "Member role updated successfully",
  MEETING_CREATED: "Meeting created successfully",
  MEETING_UPDATED: "Meeting updated successfully",
  MEETING_DELETED: "Meeting deleted successfully",
  ANNOUNCEMENT_CREATED: "Announcement created successfully",
  ANNOUNCEMENT_UPDATED: "Announcement updated successfully",
  ANNOUNCEMENT_DELETED: "Announcement deleted successfully",
  EVENT_CREATED: "Event created successfully",
  EVENT_UPDATED: "Event updated successfully",
  EVENT_DELETED: "Event deleted successfully",
  TRANSACTION_CREATED: "Transaction created successfully",
  TRANSACTION_UPDATED: "Transaction updated successfully",
  TRANSACTION_DELETED: "Transaction deleted successfully",
};

// Error messages
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_ALREADY_EXISTS: "Email is already registered",
  USER_NOT_FOUND: "User not found",
  TOKEN_REQUIRED: "Authentication token is required",
  INVALID_TOKEN: "Invalid authentication token",
  TOKEN_EXPIRED: "Authentication token has expired",

  // Authorization errors
  UNAUTHORIZED: "Unauthorized - You must be logged in",
  FORBIDDEN: "Forbidden - You do not have permission to perform this action",

  // Input validation errors
  INVALID_INPUT: "Invalid input data",
  REQUIRED_FIELDS_MISSING: "Required fields are missing",
  INVALID_EMAIL_FORMAT: "Invalid email format",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match",

  // Resource errors
  RESOURCE_NOT_FOUND: "Resource not found",
  GROUP_NOT_FOUND: "Group not found",
  MEETING_NOT_FOUND: "Meeting not found",
  ANNOUNCEMENT_NOT_FOUND: "Announcement not found",
  EVENT_NOT_FOUND: "Event not found",
  TRANSACTION_NOT_FOUND: "Transaction not found",

  // Group-related errors
  NOT_GROUP_MEMBER: "You are not a member of this group",
  NOT_GROUP_ADMIN: "You must be a group admin to perform this action",
  USER_ALREADY_IN_GROUP: "User is already a member of this group",
  USER_NOT_IN_GROUP: "User is not a member of this group",
  CANNOT_REMOVE_LAST_ADMIN: "Cannot remove the last admin from the group",

  // Server errors
  INTERNAL_SERVER_ERROR: "Internal server error",
  SERVICE_UNAVAILABLE: "Service temporarily unavailable",
  DATABASE_ERROR: "Database error",
};

// Date constants
export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Meeting formats
export const MEETING_FORMATS = [
  "Open Discussion",
  "Speaker",
  "Step Study",
  "Big Book Study",
  "Meditation",
  "Beginner",
  "Literature Study",
  "Topic Discussion",
  "Speaker/Discussion",
  "Men Only",
  "Women Only",
  "LGBTQ+",
  "Young People",
  "Other",
];

// Treasury categories
export const INCOME_CATEGORIES = [
  "7th Tradition",
  "Literature Sales",
  "Event Income",
  "Other Income",
];

export const EXPENSE_CATEGORIES = [
  "Rent",
  "Literature Purchase",
  "Refreshments",
  "Events",
  "Contributions",
  "Other Expense",
];

// Regular expressions
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
export const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM in 24h format

// Pagination defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
];
