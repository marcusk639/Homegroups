import {v4 as uuidv4} from 'uuid';
import * as firestoreUtils from '../utils/firestore';
import {Event, EventCreationData, EventUpdateData} from '../types/event';
import {Group, GroupMember} from '../types/group';

export const createEvent = async (
  userId: string,
  eventData: EventCreationData,
): Promise<Event> => {
  // Verify user is a member of the group
  const groupDoc = await firestoreUtils.getDocById<Group>(
    'groups',
    eventData.groupId,
  );
  if (!groupDoc) {
    throw new Error('Group not found');
  }

  const userMember = groupDoc.members.find(member => member.uid === userId);
  if (!userMember) {
    throw new Error('User is not a member of the group');
  }

  const eventId = uuidv4();
  const now = new Date();

  const newEvent: Partial<Event> = {
    id: eventId,
    ...eventData,
    attendees: [userId],
    createdAt: now,
    updatedAt: now,
  };

  await firestoreUtils.setDoc(`events/${eventId}`, newEvent);
  return newEvent as Event;
};

export const getEventById = async (
  userId: string,
  eventId: string,
): Promise<Event | null> => {
  const eventDoc = await firestoreUtils.getDocById<Event>('events', eventId);
  if (!eventDoc) {
    return null;
  }

  // Verify user is a member of the group
  const groupDoc = await firestoreUtils.getDocById<Group>(
    'groups',
    eventDoc.groupId,
  );
  if (!groupDoc) {
    throw new Error('Group not found');
  }

  const userMember = groupDoc.members.find(member => member.uid === userId);
  if (!userMember) {
    throw new Error('Unauthorized');
  }

  return eventDoc;
};

export const updateEvent = async (
  userId: string,
  eventId: string,
  eventData: EventUpdateData,
): Promise<Event | null> => {
  const eventDoc = await firestoreUtils.getDocById<Event>('events', eventId);
  if (!eventDoc) {
    return null;
  }

  // Verify user is an admin of the group
  const groupDoc = await firestoreUtils.getDocById<Group>(
    'groups',
    eventDoc.groupId,
  );
  if (!groupDoc) {
    throw new Error('Group not found');
  }

  const userMember = groupDoc.members.find(member => member.uid === userId);
  if (!userMember || !userMember.isAdmin) {
    throw new Error('Unauthorized');
  }

  const updatedEvent = {
    ...eventDoc,
    ...eventData,
    updatedAt: new Date(),
  };

  await firestoreUtils.updateDoc(`events/${eventId}`, updatedEvent);
  return updatedEvent;
};

export const deleteEvent = async (
  userId: string,
  eventId: string,
): Promise<void> => {
  const eventDoc = await firestoreUtils.getDocById<Event>('events', eventId);
  if (!eventDoc) {
    throw new Error('Event not found');
  }

  // Verify user is an admin of the group
  const groupDoc = await firestoreUtils.getDocById<Group>(
    'groups',
    eventDoc.groupId,
  );
  if (!groupDoc) {
    throw new Error('Group not found');
  }

  const userMember = groupDoc.members.find(member => member.uid === userId);
  if (!userMember || !userMember.isAdmin) {
    throw new Error('Unauthorized');
  }

  await firestoreUtils.deleteDoc(`events/${eventId}`);
};

export const getGroupEvents = async (
  userId: string,
  groupId: string,
): Promise<Event[]> => {
  // Verify user is a member of the group
  const groupDoc = await firestoreUtils.getDocById<Group>('groups', groupId);
  if (!groupDoc) {
    throw new Error('Group not found');
  }

  const userMember = groupDoc.members.find(member => member.uid === userId);
  if (!userMember) {
    throw new Error('Unauthorized');
  }

  const events = await firestoreUtils.getDocs<Event>(
    firestoreUtils.colRef<Event>('events').where('groupId', '==', groupId),
  );

  return events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const joinEvent = async (
  userId: string,
  eventId: string,
): Promise<Event | null> => {
  const eventDoc = await firestoreUtils.getDocById<Event>('events', eventId);
  if (!eventDoc) {
    return null;
  }

  // Verify user is a member of the group
  const groupDoc = await firestoreUtils.getDocById<Group>(
    'groups',
    eventDoc.groupId,
  );
  if (!groupDoc) {
    throw new Error('Group not found');
  }

  const userMember = groupDoc.members.find(member => member.uid === userId);
  if (!userMember) {
    throw new Error('Unauthorized');
  }

  if (eventDoc.attendees.includes(userId)) {
    return eventDoc;
  }

  const updatedEvent = {
    ...eventDoc,
    attendees: [...eventDoc.attendees, userId],
    updatedAt: new Date(),
  };

  await firestoreUtils.updateDoc(`events/${eventId}`, updatedEvent);
  return updatedEvent;
};

export const leaveEvent = async (
  userId: string,
  eventId: string,
): Promise<Event | null> => {
  const eventDoc = await firestoreUtils.getDocById<Event>('events', eventId);
  if (!eventDoc) {
    return null;
  }

  // Verify user is a member of the group
  const groupDoc = await firestoreUtils.getDocById<Group>(
    'groups',
    eventDoc.groupId,
  );
  if (!groupDoc) {
    throw new Error('Group not found');
  }

  const userMember = groupDoc.members.find(member => member.uid === userId);
  if (!userMember) {
    throw new Error('Unauthorized');
  }

  if (!eventDoc.attendees.includes(userId)) {
    return eventDoc;
  }

  const updatedEvent = {
    ...eventDoc,
    attendees: eventDoc.attendees.filter(id => id !== userId),
    updatedAt: new Date(),
  };

  await firestoreUtils.updateDoc(`events/${eventId}`, updatedEvent);
  return updatedEvent;
};
