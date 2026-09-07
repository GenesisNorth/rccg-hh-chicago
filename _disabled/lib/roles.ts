import { UserRole } from './firestore-types';

/**
 * Single source of truth for role-based permission checks.
 * Never compare `user.role` against string literals elsewhere —
 * roles are UPPERCASE (`UserRole` enum) and lowercase comparisons
 * silently fail (see FIX_TRACKER.md Phase 3).
 *
 * NOTE: these are UI-gating helpers only. Real enforcement lives in
 * Firestore rules and (Phase 5) authenticated API routes.
 */

type MaybeRole = UserRole | string | null | undefined;

/** SUPERADMIN, ADMIN, PASTOR — may open the admin panel and manage content. */
export const ADMIN_PANEL_ROLES: string[] = [
  UserRole.SUPERADMIN,
  UserRole.ADMIN,
  UserRole.PASTOR,
];

/** Admin panel roles plus LEADER — leadership-level navigation and posting. */
export const LEADERSHIP_ROLES: string[] = [...ADMIN_PANEL_ROLES, UserRole.LEADER];

export const isSuperAdmin = (role: MaybeRole): boolean =>
  role === UserRole.SUPERADMIN;

/** Admin panel access: SUPERADMIN, ADMIN, PASTOR. */
export const canAccessAdminPanel = (role: MaybeRole): boolean =>
  !!role && ADMIN_PANEL_ROLES.includes(role);

/** Content management (sermons, events, devotionals, media, announcements): SUPERADMIN, ADMIN, PASTOR. */
export const canManageContent = canAccessAdminPanel;

/** User management (roles, deletion): SUPERADMIN, ADMIN. Role grants to ADMIN/PASTOR remain SUPERADMIN-only in the UI. */
export const canManageUsers = (role: MaybeRole): boolean =>
  role === UserRole.SUPERADMIN || role === UserRole.ADMIN;

/** SUPERADMIN, ADMIN, PASTOR or LEADER. */
export const hasLeadershipRole = (role: MaybeRole): boolean =>
  !!role && LEADERSHIP_ROLES.includes(role);
