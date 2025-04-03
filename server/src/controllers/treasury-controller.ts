import {Request, Response} from 'express';
import {TransactionCreationData} from '../types/treasury';
import * as treasuryService from '../services/treasury-service';

export const getGroupTreasury = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    const {groupId} = req.params;
    const treasury = await treasuryService.getGroupTreasury(userId, groupId);
    res.json(treasury);
  } catch (error) {
    console.error('Error getting group treasury:', error);
    res.status(500).json({error: 'Failed to get group treasury'});
  }
};

export const addTreasuryTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    const {groupId} = req.params;
    const transactionData: TransactionCreationData = req.body;
    const treasury = await treasuryService.addTreasuryTransaction(
      userId,
      groupId,
      transactionData,
    );
    res.status(201).json(treasury);
  } catch (error) {
    console.error('Error adding treasury transaction:', error);
    res.status(500).json({error: 'Failed to add treasury transaction'});
  }
};

export const updatePrudentReserve = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    const {groupId} = req.params;
    const {amount} = req.body;
    const treasury = await treasuryService.updatePrudentReserve(
      userId,
      groupId,
      amount,
    );
    res.json(treasury);
  } catch (error) {
    console.error('Error updating prudent reserve:', error);
    res.status(500).json({error: 'Failed to update prudent reserve'});
  }
};
