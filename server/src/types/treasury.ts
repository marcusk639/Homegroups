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
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  groupId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionCreationData {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
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
