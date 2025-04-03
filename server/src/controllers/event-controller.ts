import { Request, Response } from "express";
import { EventCreationData, EventUpdateData } from "../types/event";
import * as eventService from "../services/event-service";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const eventData: EventCreationData = req.body;
    const event = await eventService.createEvent(userId, eventData);
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { eventId } = req.params;
    const event = await eventService.getEventById(userId, eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error getting event:", error);
    res.status(500).json({ error: "Failed to get event" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { eventId } = req.params;
    const eventData: EventUpdateData = req.body;
    const event = await eventService.updateEvent(userId, eventId, eventData);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { eventId } = req.params;
    await eventService.deleteEvent(userId, eventId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
};

export const getGroupEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { groupId } = req.params;
    const events = await eventService.getGroupEvents(userId, groupId);
    res.json(events);
  } catch (error) {
    console.error("Error getting group events:", error);
    res.status(500).json({ error: "Failed to get group events" });
  }
};

export const joinEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { eventId } = req.params;
    const event = await eventService.joinEvent(userId, eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({ error: "Failed to join event" });
  }
};

export const leaveEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { eventId } = req.params;
    const event = await eventService.leaveEvent(userId, eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error leaving event:", error);
    res.status(500).json({ error: "Failed to leave event" });
  }
};
