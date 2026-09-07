import { adminDb } from "./firebase-admin";
import { Timestamp, Query } from "firebase-admin/firestore";
import { COLLECTIONS } from "./firestore-types";

/**
 * Admin-SDK Firestore access for API routes. Bypasses security rules,
 * so every route using these services MUST authenticate the caller
 * via lib/server-auth.ts first.
 */

/** Recursively converts Admin Timestamps to ISO strings for JSON responses. */
export function serialize<T>(value: T): any {
  if (value === null || value === undefined) return value;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(serialize);
  if (typeof value === "object") {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value as Record<string, any>)) {
      out[k] = serialize(v);
    }
    return out;
  }
  return value;
}

/** Converts an ISO/date string to an Admin Timestamp (null-safe). */
export function toTimestamp(value?: string | Date | null): Timestamp | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? null : Timestamp.fromDate(date);
}

export class AdminFirestoreService<T extends { id: string }> {
  constructor(private collectionName: string) {}

  private get collection() {
    return adminDb.collection(this.collectionName);
  }

  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const now = Timestamp.now();
    const docRef = await this.collection.add({ ...data, createdAt: now, updatedAt: now });
    return docRef.id;
  }

  async getById(id: string): Promise<T | null> {
    const snap = await this.collection.doc(id).get();
    return snap.exists ? ({ id: snap.id, ...snap.data() } as T) : null;
  }

  async update(id: string, data: Partial<Omit<T, "id" | "createdAt">>): Promise<void> {
    await this.collection.doc(id).update({ ...data, updatedAt: Timestamp.now() });
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async getAll(buildQuery?: (ref: Query) => Query): Promise<T[]> {
    const query = buildQuery ? buildQuery(this.collection) : this.collection;
    const snap = await query.get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  }

  async count(buildQuery?: (ref: Query) => Query): Promise<number> {
    const query = buildQuery ? buildQuery(this.collection) : this.collection;
    const snap = await query.count().get();
    return snap.data().count;
  }
}

export const adminUserService = new AdminFirestoreService<any>(COLLECTIONS.USERS);
export const adminSermonService = new AdminFirestoreService<any>(COLLECTIONS.SERMONS);
export const adminEventService = new AdminFirestoreService<any>(COLLECTIONS.EVENTS);
export const adminDevotionalService = new AdminFirestoreService<any>(COLLECTIONS.DEVOTIONALS);
export const adminMediaService = new AdminFirestoreService<any>(COLLECTIONS.MEDIA);
export const adminDonationService = new AdminFirestoreService<any>(COLLECTIONS.DONATIONS);
export const adminDepartmentService = new AdminFirestoreService<any>(COLLECTIONS.DEPARTMENTS);
export const adminAnnouncementService = new AdminFirestoreService<any>(COLLECTIONS.ANNOUNCEMENTS);
export const adminNotificationService = new AdminFirestoreService<any>(COLLECTIONS.NOTIFICATIONS);
export const adminEventRegistrationService = new AdminFirestoreService<any>(COLLECTIONS.EVENT_REGISTRATIONS);
