// // Type definitions for Firestore documents
// export interface UserData {
//   displayName: string;
//   recoveryDate?: string;
//   homeGroups: string[];
//   updatedAt: Date;
// }

// export interface GroupDoc {
//   id: string;
//   name: string;
//   description: string;
//   meetingDay: string;
//   memberCount: number;
//   admins: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface MemberDoc {
//   uid: string;
//   displayName: string;
//   recoveryDate?: string;
//   joinedAt: Date;
//   position?: string;
//   isAdmin: boolean;
//   updatedAt: Date;
// }

// export interface AnnouncementDoc {
//   id: string;
//   title: string;
//   content: string;
//   isPinned: boolean;
//   createdBy: string;
//   authorName: string;
//   expiresAt: Date | null;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface EventDoc {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   time: string;
//   duration: number;
//   location: string;
//   address: string | null;
//   isOnline: boolean;
//   onlineLink: string | null;
//   createdBy: string;
//   attendees: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface TreasuryDoc {
//   id: string;
//   balance: number;
//   prudentReserve: number;
//   transactions: TransactionDoc[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface TransactionDoc {
//   id: string;
//   type: 'income' | 'expense';
//   amount: number;
//   category: string;
//   description: string;
//   date: Date;
//   createdBy: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
