import express from "express";
import { authenticate } from "../middleware/auth";
import {
  getGroupTreasury,
  addTreasuryTransaction,
  updatePrudentReserve,
} from "../controllers/treasury-controller";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get group treasury
router.get("/group/:groupId", getGroupTreasury);

// Add a transaction
router.post("/group/:groupId/transactions", addTreasuryTransaction);

// Update prudent reserve
router.put("/group/:groupId/prudent-reserve", updatePrudentReserve);

export default router;
