import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  QueryConstraint,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from './firestore-types';

// Generic CRUD operations
export class FirestoreService<T extends { id: string }> {
  constructor(private collectionName: string) {}

  // Create document
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, this.collectionName), docData);
    return docRef.id;
  }

  // Get document by ID
  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  // Update document
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  // Delete document
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  // Get all documents with optional constraints
  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    const q = query(collection(db, this.collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
  }

  // Paginated query
  async getPaginated(
    pageSize: number = 10,
    lastDoc?: DocumentSnapshot,
    constraints: QueryConstraint[] = []
  ): Promise<{ docs: T[]; lastDoc: DocumentSnapshot | null }> {
    const queryConstraints = [...constraints, limit(pageSize)];
    
    if (lastDoc) {
      queryConstraints.push(startAfter(lastDoc));
    }
    
    const q = query(collection(db, this.collectionName), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
    
    const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    
    return { docs, lastDoc: lastDocument };
  }

  // Real-time listener
  onSnapshot(
    callback: (docs: T[]) => void,
    constraints: QueryConstraint[] = []
  ): Unsubscribe {
    const q = query(collection(db, this.collectionName), ...constraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T));
      callback(docs);
    });
  }

  // Real-time listener for single document
  onDocSnapshot(id: string, callback: (doc: T | null) => void): Unsubscribe {
    const docRef = doc(db, this.collectionName, id);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        callback(null);
      }
    });
  }
}

// Specific service instances
import {
  User,
  Department,
  Sermon,
  Devotional,
  Announcement,
  Donation,
  Attendance,
  Assignment,
  Chat,
  GroupChat,
  Notification,
  Event,
  EventRegistration,
  Media
} from './firestore-types';

export const userService = new FirestoreService<User>(COLLECTIONS.USERS);
export const departmentService = new FirestoreService<Department>(COLLECTIONS.DEPARTMENTS);
export const sermonService = new FirestoreService<Sermon>(COLLECTIONS.SERMONS);
export const devotionalService = new FirestoreService<Devotional>(COLLECTIONS.DEVOTIONALS);
export const announcementService = new FirestoreService<Announcement>(COLLECTIONS.ANNOUNCEMENTS);
export const donationService = new FirestoreService<Donation>(COLLECTIONS.DONATIONS);
export const attendanceService = new FirestoreService<Attendance>(COLLECTIONS.ATTENDANCE);
export const assignmentService = new FirestoreService<Assignment>(COLLECTIONS.ASSIGNMENTS);
export const chatService = new FirestoreService<Chat>(COLLECTIONS.CHATS);
export const groupChatService = new FirestoreService<GroupChat>(COLLECTIONS.GROUP_CHATS);
export const notificationService = new FirestoreService<Notification>(COLLECTIONS.NOTIFICATIONS);
export const eventService = new FirestoreService<Event>(COLLECTIONS.EVENTS);
export const eventRegistrationService = new FirestoreService<EventRegistration>(COLLECTIONS.EVENT_REGISTRATIONS);
export const mediaService = new FirestoreService<Media>(COLLECTIONS.MEDIA);

// Helper functions
export const convertTimestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

export const convertDateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Search utilities
export const searchSermons = async (searchTerm: string, limit_: number = 10) => {
  // For now, we'll do client-side filtering. In production, consider Algolia or similar
  const allSermons = await sermonService.getAll([
    orderBy('createdAt', 'desc'),
    limit(100) // Get recent sermons first
  ]);
  
  const searchTermLower = searchTerm.toLowerCase();
  
  return allSermons
    .filter(sermon => 
      sermon.title.toLowerCase().includes(searchTermLower) ||
      sermon.content.toLowerCase().includes(searchTermLower) ||
      sermon.tags.some(tag => tag.toLowerCase().includes(searchTermLower)) ||
      (sermon.series && sermon.series.toLowerCase().includes(searchTermLower))
    )
    .slice(0, limit_);
};

export const getUsersByRole = async (role: string) => {
  return userService.getAll([
    where('role', '==', role),
    orderBy('name', 'asc')
  ]);
};

export const getUserDonations = async (userId: string) => {
  return donationService.getAll([
    where('donorId', '==', userId),
    orderBy('createdAt', 'desc')
  ]);
};

export const getDepartmentMembers = async (departmentId: string) => {
  return userService.getAll([
    where('departmentIds', 'array-contains', departmentId),
    orderBy('name', 'asc')
  ]);
};