export type TransactionType = 'income' | 'expense';
export type TransactionCategory =
  | '7th Tradition'
  | 'Literature Sales'
  | 'Event Income'
  | 'Other Income'
  | 'Rent'
  | 'Literature Purchase'
  | 'Refreshments'
  | 'Events'
  | 'Contributions'
  | 'Other Expense';

export interface Treasury {
  id: string;
  groupId: string;
  balance: number;
  prudentReserve: number;
  transactions: Transaction[];
}
export interface Transaction {
  id: string;
  groupId: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
  authorName: string; // Display name
  receipt?: string; // URL to image
}

export interface TransactionCreationData {
  groupId: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: string; // YYYY-MM-DD
  receipt?: string;
}

export interface TransactionUpdateData {
  type?: TransactionType;
  amount?: number;
  category?: TransactionCategory;
  description?: string;
  date?: string;
  receipt?: string;
}

export interface TreasuryOverview {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  prudentReserve: number;
  availableFunds: number;
  lastUpdated: Date;
}
