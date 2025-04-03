// Firestore Database Schema for Recovery Connect

// Collection: users
{
uid: string, // Firebase Auth UID
email: string, // User's email address
displayName: string, // First name or initial
recoveryDate: string | null, // YYYY-MM-DD (optional)
createdAt: timestamp,
updatedAt: timestamp,
lastLogin: timestamp,

notificationSettings: {
meetings: boolean, // default: true
announcements: boolean, // default: true
celebrations: boolean // default: true
},

privacySettings: {
showRecoveryDate: boolean, // default: false
allowDirectMessages: boolean // default: true
},

homeGroups: [string], // Array of group IDs
role: 'user' | 'admin' // default: 'user'
}

// Collection: groups
{
id: string,
name: string,
description: string,
meetingDay: string,
meetingTime: string,
location: string,
address: string | null,
format: string,
isOnline: boolean,
onlineLink: string | null,
createdAt: timestamp,
updatedAt: timestamp,
foundedDate: string | null, // YYYY-MM-DD
memberCount: number, // For quick access
admins: [string] // Array of admin user IDs
}

// Sub-collection: groups/{groupId}/members
{
uid: string, // User ID
displayName: string,
recoveryDate: string | null,
joinedAt: timestamp,
position: string | null, // Secretary, treasurer, etc.
isAdmin: boolean
}

// Sub-collection: groups/{groupId}/announcements
{
id: string,
title: string,
content: string,
isPinned: boolean,
createdAt: timestamp,
updatedAt: timestamp,
createdBy: string, // User ID
authorName: string, // Display name
expiresAt: timestamp | null
}

// Sub-collection: groups/{groupId}/events
{
id: string,
title: string,
description: string,
date: string, // YYYY-MM-DD
time: string, // HH:MM
duration: number, // In minutes
location: string,
address: string | null,
isOnline: boolean,
onlineLink: string | null,
createdAt: timestamp,
updatedAt: timestamp,
createdBy: string, // User ID
attendees: [string] | null // Array of user IDs
}

// Sub-collection: groups/{groupId}/transactions
{
id: string,
type: 'income' | 'expense',
amount: number,
category: string,
description: string | null,
date: string, // YYYY-MM-DD
createdAt: timestamp,
updatedAt: timestamp,
createdBy: string, // User ID
authorName: string, // Display name
receipt: string | null // URL to image
}

// Collection: meetings
{
id: string,
groupId: string,
name: string,
description: string | null,
day: string,
time: string,
duration: number, // In minutes
location: string,
address: string | null,
format: string,
isOnline: boolean,
onlineLink: string | null,
isRecurring: boolean,
recurrencePattern: string | null, // e.g., "weekly", "monthly"
createdAt: timestamp,
updatedAt: timestamp,
createdBy: string // User ID
}

// Collection: celebrations (sobriety milestones)
{
id: string,
userId: string,
groupId: string,
displayName: string,
years: number,
date: string, // YYYY-MM-DD
acknowledged: boolean
}
