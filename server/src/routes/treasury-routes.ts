<<<<<<< HEAD
import express from 'express';
import {authenticate} from '../middleware/auth';
=======
import express from "express";
import { authenticate } from "../middleware/auth";
>>>>>>> monorepo-setup
import {
  getGroupTreasury,
  addTreasuryTransaction,
  updatePrudentReserve,
<<<<<<< HEAD
} from '../controllers/treasury-controller';
=======
} from "../controllers/treasury-controller";
>>>>>>> monorepo-setup

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get group treasury
<<<<<<< HEAD
router.get('/group/:groupId', getGroupTreasury);

// Add a transaction
router.post('/group/:groupId/transactions', addTreasuryTransaction);

// Update prudent reserve
router.put('/group/:groupId/prudent-reserve', updatePrudentReserve);
=======
router.get("/group/:groupId", getGroupTreasury);

// Add a transaction
router.post("/group/:groupId/transactions", addTreasuryTransaction);

// Update prudent reserve
router.put("/group/:groupId/prudent-reserve", updatePrudentReserve);
>>>>>>> monorepo-setup

export default router;
