import { db } from "../config/firebase";
import {
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  DocumentReference,
  CollectionReference,
  Query,
  QuerySnapshot,
  Timestamp,
} from "firebase-admin/firestore";
import logger from "./logger";

/**
 * Standard Firestore data converter
 * Automatically handles conversion between Firestore and TypeScript types
 */
export const converter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: T) => {
    // Convert any Date objects to Firestore Timestamps
    const processedData = { ...(data as object) };

    for (const [key, value] of Object.entries(processedData)) {
      if (value instanceof Date) {
        processedData[key] = Timestamp.fromDate(value);
      }
    }

    return processedData as DocumentData;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
    const data = snapshot.data();

    // Convert Firestore Timestamps back to JavaScript Dates
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof Timestamp) {
        data[key] = value.toDate();
      }
    }

    // Add the document ID to the data
    return { ...data, id: snapshot.id } as unknown as T;
  },
});

/**
 * Get a typed document reference
 */
export const docRef = <T>(path: string): DocumentReference<T> => {
  return db.doc(path).withConverter(converter<T>());
};

/**
 * Get a typed collection reference
 */
export const colRef = <T>(path: string): CollectionReference<T> => {
  return db.collection(path).withConverter(converter<T>());
};

/**
 * Get all documents from a query
 */
export const getDocs = async <T>(query: Query<T>): Promise<T[]> => {
  try {
    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    logger.error(`Error getting documents: ${error}`);
    throw error;
  }
};

/**
 * Get a document by reference
 */
export const getDoc = async <T>(
  ref: DocumentReference<T>
): Promise<T | null> => {
  try {
    const doc = await ref.get();
    return doc.exists ? (doc.data() as T) : null;
  } catch (error) {
    logger.error(`Error getting document: ${error}`);
    throw error;
  }
};

/**
 * Create a document with auto-generated ID
 */
export const createDoc = async <T>(
  collectionPath: string,
  data: Partial<T>
): Promise<{ id: string; data: T }> => {
  try {
    const collectionRef = colRef<T>(collectionPath);
    const docRef = await collectionRef.add({
      ...(data as object),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    } as unknown as T);

    const doc = await docRef.get();
    return { id: doc.id, data: doc.data() as T };
  } catch (error) {
    logger.error(`Error creating document: ${error}`);
    throw error;
  }
};

/**
 * Create a document with a specific ID
 */
export const setDoc = async <T>(
  documentPath: string,
  data: Partial<T>,
  merge: boolean = false
): Promise<void> => {
  try {
    const ref = docRef<T>(documentPath);

    const dataWithTimestamps = {
      ...(data as object),
      updatedAt: Timestamp.now(),
    };

    // Add createdAt if this is a new document
    if (!merge) {
      dataWithTimestamps.createdAt = Timestamp.now();
    }

    await ref.set(dataWithTimestamps as unknown as T, { merge });
  } catch (error) {
    logger.error(`Error setting document: ${error}`);
    throw error;
  }
};

/**
 * Update an existing document
 */
export const updateDoc = async <T>(
  documentPath: string,
  data: Partial<T>
): Promise<void> => {
  try {
    const ref = docRef<T>(documentPath);

    await ref.update({
      ...(data as object),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    logger.error(`Error updating document: ${error}`);
    throw error;
  }
};

/**
 * Delete a document
 */
export const deleteDoc = async (documentPath: string): Promise<void> => {
  try {
    await db.doc(documentPath).delete();
  } catch (error) {
    logger.error(`Error deleting document: ${error}`);
    throw error;
  }
};

/**
 * Get all documents in a collection
 */
export const getCollection = async <T>(
  collectionPath: string
): Promise<T[]> => {
  try {
    return await getDocs<T>(colRef<T>(collectionPath));
  } catch (error) {
    logger.error(`Error getting collection: ${error}`);
    throw error;
  }
};

/**
 * Get all documents in a subcollection
 */
export const getSubCollection = async <T>(
  documentPath: string,
  subCollectionName: string
): Promise<T[]> => {
  try {
    const path = `${documentPath}/${subCollectionName}`;
    return await getDocs<T>(colRef<T>(path));
  } catch (error) {
    logger.error(`Error getting subcollection: ${error}`);
    throw error;
  }
};

/**
 * Execute query in a transaction
 */
export const runTransaction = async <T>(
  callback: (transaction: FirebaseFirestore.Transaction) => Promise<T>
): Promise<T> => {
  try {
    return await db.runTransaction(callback);
  } catch (error) {
    logger.error(`Error running transaction: ${error}`);
    throw error;
  }
};

/**
 * Execute a batch write
 */
export const runBatch = async (
  callback: (batch: FirebaseFirestore.WriteBatch) => void
): Promise<void> => {
  try {
    const batch = db.batch();
    callback(batch);
    await batch.commit();
  } catch (error) {
    logger.error(`Error running batch: ${error}`);
    throw error;
  }
};

/**
 * Check if a document exists
 */
export const docExists = async (documentPath: string): Promise<boolean> => {
  try {
    const doc = await db.doc(documentPath).get();
    return doc.exists;
  } catch (error) {
    logger.error(`Error checking document existence: ${error}`);
    throw error;
  }
};

/**
 * Format data for Firestore
 * Converts dates, removes undefined values, etc.
 */
export const formatForFirestore = (data: any): any => {
  if (!data) return data;

  const result = { ...data };

  for (const [key, value] of Object.entries(result)) {
    // Convert Date objects to Firestore Timestamps
    if (value instanceof Date) {
      result[key] = Timestamp.fromDate(value);
    }
    // Convert nested objects
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = formatForFirestore(value);
    }
    // Remove undefined values (Firestore doesn't accept them)
    else if (value === undefined) {
      delete result[key];
    }
  }

  return result;
};

export const generateId = () => {
  return db.collection("").doc().id;
};
