recovery-connect-backend/
├── src/
│ ├── config/
│ │ └── firebase.ts # Firebase Admin SDK configuration
│ ├── controllers/
│ │ ├── authController.ts
│ │ ├── userController.ts
│ │ ├── groupController.ts
│ │ ├── meetingController.ts
│ │ ├── announcementController.ts
│ │ ├── eventController.ts
│ │ └── treasuryController.ts
│ ├── middleware/
│ │ ├── auth.ts # Authentication middleware
│ │ ├── validation.ts # Request validation middleware
│ │ └── error.ts # Error handling middleware
│ ├── services/
│ │ ├── authService.ts # Firebase Auth operations
│ │ ├── userService.ts # User Firestore operations
│ │ ├── groupService.ts # Group Firestore operations
│ │ ├── meetingService.ts # Meeting Firestore operations
│ │ ├── announcementService.ts # Announcement Firestore operations
│ │ ├── eventService.ts # Event Firestore operations
│ │ └── treasuryService.ts # Treasury Firestore operations
│ ├── routes/
│ │ ├── authRoutes.ts
│ │ ├── userRoutes.ts
│ │ ├── groupRoutes.ts
│ │ ├── meetingRoutes.ts
│ │ ├── announcementRoutes.ts
│ │ ├── eventRoutes.ts
│ │ └── treasuryRoutes.ts
│ ├── utils/
│ │ ├── logger.ts # Logging utility
│ │ ├── helpers.ts # Helper functions
│ │ ├── constants.ts # Constants and error messages
│ │ └── firestore.ts # Firestore helper functions
│ ├── types/
│ │ ├── auth.ts # Authentication types
│ │ ├── user.ts # User types
│ │ ├── group.ts # Group types
│ │ ├── meeting.ts # Meeting types
│ │ ├── announcement.ts # Announcement types
│ │ ├── event.ts # Event types
│ │ └── treasury.ts # Treasury types
│ ├── app.ts # Express app setup
│ └── server.ts # Server entry point
├── .env # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
