'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  sermonService, 
  userService, 
  donationService, 
  notificationService,
  announcementService,
  devotionalService 
} from '../lib/firestore-utils';
import { Sermon, User, Donation, Notification, Announcement, Devotional } from '../lib/firestore-types';

// Generic hook for real-time document
export function useDocument<T>(collectionName: string, docId: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      doc(db, collectionName, docId),
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}/${docId}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
}

// Generic hook for real-time collection
export function useCollection<T>(collectionName: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as T));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}

// Sermons hook
export function useSermons(featured?: boolean, seriesFilter?: string, limitCount = 10) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  
  if (featured) {
    constraints.unshift(where('featured', '==', true));
  }
  
  if (seriesFilter) {
    constraints.unshift(where('series', '==', seriesFilter));
  }
  
  constraints.push(limit(limitCount));

  return useCollection<Sermon>('sermons', constraints);
}

// Single sermon hook
export function useSermon(sermonId: string | null) {
  return useDocument<Sermon>('sermons', sermonId);
}

// User notifications hook
export function useUserNotifications(userId: string | null, unreadOnly = false) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  
  if (userId) {
    constraints.unshift(where('userId', '==', userId));
  }
  
  if (unreadOnly) {
    constraints.push(where('read', '==', false));
  }
  
  constraints.push(limit(50));

  return useCollection<Notification>('notifications', constraints);
}

// User donations hook
export function useUserDonations(userId: string | null) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  
  if (userId) {
    constraints.unshift(where('donorId', '==', userId));
  }
  
  constraints.push(limit(20));

  return useCollection<Donation>('donations', constraints);
}

// Announcements hook
export function useAnnouncements(limitCount = 10) {
  const constraints: QueryConstraint[] = [
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  ];

  return useCollection<Announcement>('announcements', constraints);
}

// Devotionals hook
export function useDevotionals(limitCount = 10) {
  const constraints: QueryConstraint[] = [
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  ];

  return useCollection<Devotional>('devotionals', constraints);
}

// Users hook (admin only)
export function useUsers(role?: string, limitCount = 50) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  
  if (role) {
    constraints.unshift(where('role', '==', role));
  }
  
  constraints.push(limit(limitCount));

  return useCollection<User>('users', constraints);
}

// Hook for paginated data
export function usePaginatedCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  pageSize = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      let service;
      
      // Get appropriate service based on collection name
      switch (collectionName) {
        case 'sermons':
          service = sermonService;
          break;
        case 'users':
          service = userService;
          break;
        case 'donations':
          service = donationService;
          break;
        case 'notifications':
          service = notificationService;
          break;
        default:
          throw new Error(`No service found for collection: ${collectionName}`);
      }

      const result = await service.getPaginated(pageSize, lastDoc || undefined, constraints);
      
      if (result.docs.length < pageSize) {
        setHasMore(false);
      }
      
      setData(prev => [...prev, ...result.docs as T[]]);
      setLastDoc(result.lastDoc);
    } catch (err: any) {
      console.error(`Error loading more ${collectionName}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData([]);
    setLastDoc(null);
    setHasMore(true);
    setError(null);
  };

  useEffect(() => {
    reset();
    loadMore();
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error, hasMore, loadMore, reset };
}

// Search hook
export function useSearch<T>(searchTerm: string, searchFunction: (term: string) => Promise<T[]>) {
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const searchDelay = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const searchResults = await searchFunction(searchTerm);
        setResults(searchResults);
      } catch (err: any) {
        console.error('Search error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(searchDelay);
  }, [searchTerm, searchFunction]);

  return { results, loading, error };
}