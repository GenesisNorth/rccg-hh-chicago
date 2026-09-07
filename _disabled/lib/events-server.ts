import { adminEventRegistrationService, serialize } from "./admin-firestore";

/**
 * Enriches serialized event(s) with live registration data:
 *  - currentAttendees: number of REGISTERED registrations
 *  - isRegistered: whether the given user is registered
 *  - spotsRemaining: capacity - currentAttendees (null when uncapped)
 *
 * Kept out of the route files so list + detail stay consistent.
 */

type Enriched<T> = T & {
  currentAttendees: number;
  isRegistered: boolean;
  spotsRemaining: number | null;
};

function withCounts<T extends { id: string; capacity?: number | null }>(
  event: T,
  count: number,
  registered: boolean
): Enriched<T> {
  return {
    ...event,
    currentAttendees: count,
    isRegistered: registered,
    spotsRemaining: event.capacity != null ? Math.max(0, event.capacity - count) : null,
  };
}

/** Enrich a single already-serialized event. */
export async function enrichEvent<T extends { id: string; capacity?: number | null }>(
  event: T,
  callerUid: string | null
): Promise<Enriched<T>> {
  const regs = await adminEventRegistrationService.getAll((q) =>
    q.where("eventId", "==", event.id)
  );
  const active = regs.filter((r: any) => r.status !== "CANCELLED");
  const registered = callerUid ? active.some((r: any) => r.userId === callerUid) : false;
  return withCounts(event, active.length, registered);
}

/** Enrich a list of serialized events with a single registrations read. */
export async function enrichEvents<T extends { id: string; capacity?: number | null }>(
  events: T[],
  callerUid: string | null
): Promise<Enriched<T>[]> {
  const allRegs = await adminEventRegistrationService.getAll();
  const countByEvent = new Map<string, number>();
  const mineByEvent = new Set<string>();

  for (const r of allRegs as any[]) {
    if (r.status === "CANCELLED") continue;
    countByEvent.set(r.eventId, (countByEvent.get(r.eventId) ?? 0) + 1);
    if (callerUid && r.userId === callerUid) mineByEvent.add(r.eventId);
  }

  return events.map((e) =>
    withCounts(e, countByEvent.get(e.id) ?? 0, mineByEvent.has(e.id))
  );
}

export { serialize };
