import { z } from "zod";
import { NextResponse } from "next/server";
import { UserRole } from "./firestore-types";

/**
 * Zod schemas for API request bodies + a parse helper.
 * Routes call `parseBody(request, Schema)`; on failure it returns a typed
 * 400 response the route can return directly.
 */

export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<ParseResult<T>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map((i) => ({
      field: i.path.join(".") || "(root)",
      message: i.message,
    }));
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Validation failed", issues },
        { status: 400 }
      ),
    };
  }
  return { ok: true, data: result.data };
}

// ---- shared primitives ----
const isoDate = z.string().datetime().or(z.string().min(1)); // accepts ISO or yyyy-mm-dd
const nonEmpty = z.string().trim().min(1);

// ---- users ----
export const createUserSchema = z.object({
  name: nonEmpty.max(120),
  email: z.string().email(),
  role: z.nativeEnum(UserRole).optional(),
  phone: z.string().max(30).optional(),
  bio: z.string().max(500).optional(),
  address: z.string().max(200).optional(),
  gender: z.string().max(30).optional(),
  dateOfBirth: isoDate.optional(),
  occupation: z.string().max(120).optional(),
  maritalStatus: z.string().max(30).optional(),
  anniversary: isoDate.optional(),
  joinedChurchDate: isoDate.optional(),
  emergencyContact: z.string().max(120).optional(),
  departmentIds: z.array(z.string()).optional(),
  image: z.string().url().nullable().optional(),
}).passthrough();

export const updateUserSchema = createUserSchema.partial().extend({
  ledDepartmentIds: z.array(z.string()).optional(),
}).passthrough();

// ---- sermons ----
export const createSermonSchema = z.object({
  title: nonEmpty.max(200),
  content: nonEmpty,
}).passthrough();

// ---- events ----
export const createEventSchema = z.object({
  title: nonEmpty.max(200),
  startDate: isoDate,
  endDate: isoDate,
  registrationDeadline: isoDate.nullable().optional(),
  capacity: z.number().int().positive().nullable().optional(),
  price: z.number().nonnegative().nullable().optional(),
  registrationRequired: z.boolean().optional(),
}).passthrough();

// ---- devotionals ----
export const createDevotionalSchema = z.object({
  title: nonEmpty.max(200),
  content: nonEmpty,
  date: isoDate,
}).passthrough();

// ---- media ----
export const createMediaSchema = z.object({
  url: z.string().url(),
  type: z.enum(["IMAGE", "VIDEO", "AUDIO", "DOCUMENT"]),
  filename: nonEmpty,
  isPublic: z.boolean().optional(),
}).passthrough();

// ---- departments ----
export const createDepartmentSchema = z.object({
  name: nonEmpty.max(120),
  description: z.string().max(500).nullable().optional(),
  leaderId: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
}).passthrough();

// ---- announcements ----
export const createAnnouncementSchema = z.object({
  title: nonEmpty.max(200),
  content: nonEmpty,
  category: z.string().optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  audience: z.enum(["everyone", "members", "leadership", "ministry-specific"]).optional(),
  targetMinistry: z.string().nullable().optional(),
  expiresAt: isoDate.nullable().optional(),
  scheduledFor: isoDate.nullable().optional(),
}).passthrough();

// ---- donations ----
export const createDonationSchema = z.object({
  amount: z.union([z.number(), z.string()]).refine(
    (v) => Number(v) > 0,
    "Amount must be greater than zero"
  ),
  type: nonEmpty,
  reference: nonEmpty,
  currency: z.string().optional(),
  ministry: z.string().nullable().optional(),
  isRecurring: z.boolean().optional(),
  frequency: z.string().nullable().optional(),
  donorEmail: z.string().email().nullable().optional(),
  donorName: z.string().nullable().optional(),
  isAnonymous: z.boolean().optional(),
}).passthrough();

// ---- admin broadcast notification ----
export const broadcastNotificationSchema = z.object({
  title: nonEmpty.max(200),
  content: nonEmpty,
  targetRole: z.enum(["ALL", "LEADER", "PASTOR", "ADMIN", "MEMBER", "SUPERADMIN"]).optional(),
  type: z.string().optional(),
  actionUrl: z.string().nullable().optional(),
}).passthrough();

// ---- church settings ----
export const churchSettingsSchema = z.object({
  churchName: z.string().max(200).optional(),
  tagline: z.string().max(200).optional(),
  address: z.string().max(300).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email().or(z.literal("")).optional(),
  serviceTimes: z.array(z.object({
    day: z.string(),
    time: z.string(),
    name: z.string(),
  })).optional(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  aboutBlurb: z.string().max(2000).optional(),
  givingNote: z.string().max(1000).optional(),
}).passthrough();
