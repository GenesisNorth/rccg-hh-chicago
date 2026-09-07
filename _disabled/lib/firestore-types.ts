import { Timestamp } from 'firebase/firestore';

// User roles enum
export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  PASTOR = 'PASTOR',
  ADMIN = 'ADMIN',
  LEADER = 'LEADER',
  MEMBER = 'MEMBER'
}

// User interface
export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  password?: string; // Only for server-side
  image: string | null;
  imagePublicId: string | null;
  role: UserRole;
  bio: string | null;
  phone: string | null;
  address: string | null;
  gender: string | null;
  dateOfBirth: Timestamp | null;
  occupation: string | null;
  maritalStatus: string | null;
  anniversary: Timestamp | null;
  joinedChurchDate: Timestamp | null;
  emergencyContact: string | null;
  notificationPrefs: Record<string, any> | null;
  theme: string | null;
  privacySettings: Record<string, any> | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Relations (stored as references)
  departmentIds: string[];
  ledDepartmentIds: string[];
}

// Department interface
export interface Department {
  id: string;
  name: string;
  description: string | null;
  leaderId: string;
  memberIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Sermon interface
export interface Sermon {
  id: string;
  title: string;
  content: string;
  videoUrls: string[];
  audioUrls: string[];
  thumbnail: string | null;
  duration: string | null;
  series: string | null;
  scripture: string | null;
  tags: string[];
  featured: boolean;
  preacherId: string;
  preacherName: string; // Denormalized for easier queries
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Devotional interface
export interface Devotional {
  id: string;
  title: string;
  content: string;
  scripture: string;
  prayerPoint: string;
  date: Timestamp;
  image: string | null;
  tags: string[];
  likes: number;
  views: number;
  isPublished: boolean;
  authorId: string; // ID of the user who created it
  authorName: string; // Denormalized
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Announcement interface
export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string; // Denormalized
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  expiresAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Donation interface
export interface Donation {
  id: string;
  amount: number;
  type: 'TITHE' | 'OFFERING' | 'DONATION';
  donorId: string;
  donorName: string; // Denormalized
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentRef: string | null;
  paymentMethod: 'PAYSTACK' | 'STRIPE' | 'CASH' | 'BANK_TRANSFER';
  metadata: Record<string, any> | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Attendance interface
export interface Attendance {
  id: string;
  userId: string;
  userName: string; // Denormalized
  event: string;
  eventType: 'SERVICE' | 'PROGRAM' | 'MEETING' | 'OTHER';
  date: Timestamp;
  location: string | null;
  checkedInBy: string | null; // QR scanner user
  createdAt: Timestamp;
}

// Assignment interface
export interface Assignment {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string; // Denormalized
  assignedById: string;
  assignedByName: string; // Denormalized
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: Timestamp;
  completedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Chat interface
export interface Chat {
  id: string;
  content: string;
  senderId: string;
  senderName: string; // Denormalized
  senderImage: string | null; // Denormalized
  receiverId: string | null; // null for group chats
  groupId: string | null; // for group chats
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO';
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  replyToId: string | null; // for message replies
  edited: boolean;
  editedAt: Timestamp | null;
  createdAt: Timestamp;
}

// Group Chat interface
export interface GroupChat {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  createdById: string;
  memberIds: string[];
  adminIds: string[];
  lastMessageId: string | null;
  lastMessageAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Notification interface
export interface Notification {
  id: string;
  title: string;
  content: string;
  userId: string;
  type: 'ANNOUNCEMENT' | 'SERMON' | 'EVENT' | 'ASSIGNMENT' | 'DONATION' | 'CHAT';
  read: boolean;
  actionUrl: string | null;
  metadata: Record<string, any> | null;
  createdAt: Timestamp;
}

// Event interface
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  location: string;
  image: string | null;
  capacity: number | null;
  registrationRequired: boolean;
  registrationDeadline: Timestamp | null;
  price: number | null;
  organizerId: string;
  organizerName: string; // Denormalized
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Event Registration interface
export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string; // Denormalized
  userEmail: string; // Denormalized
  status: 'REGISTERED' | 'ATTENDED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'NOT_REQUIRED';
  paymentRef: string | null;
  registeredAt: Timestamp;
  attendedAt: Timestamp | null;
}

// Media Library interface
export interface Media {
  id: string;
  name: string; // Display name/Title
  filename: string; // Actual filename in storage
  description: string | null;
  url: string;
  thumbnailUrl: string | null;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  size: number;
  mimeType: string;
  folder: string;
  uploadedById: string;
  uploadedByName: string; // Denormalized
  tags: string[];
  category: string | null;
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  DEPARTMENTS: 'departments',
  SERMONS: 'sermons',
  DEVOTIONALS: 'devotionals',
  ANNOUNCEMENTS: 'announcements',
  DONATIONS: 'donations',
  ATTENDANCE: 'attendance',
  ASSIGNMENTS: 'assignments',
  CHATS: 'chats',
  GROUP_CHATS: 'groupChats',
  NOTIFICATIONS: 'notifications',
  EVENTS: 'events',
  EVENT_REGISTRATIONS: 'eventRegistrations',
  MEDIA: 'media'
} as const;