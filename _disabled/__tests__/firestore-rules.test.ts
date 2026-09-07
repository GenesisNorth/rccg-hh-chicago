import { readFileSync } from "fs";
import { resolve } from "path";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { beforeAll, afterAll, beforeEach, describe, it } from "vitest";

/**
 * Firestore security rules tests.
 *
 * Run with the emulator (needs Java):  npm run test:rules
 * The npm script wraps this in `firebase emulators:exec`, which starts the
 * Firestore emulator, points these tests at it, and tears it down after.
 */

// `demo-` prefix tells the Firebase emulator no real credentials are needed
const PROJECT_ID = "demo-lsc-abuja";
let testEnv: RulesTestEnvironment;

// role → uid, each seeded with a matching /users/{uid} doc so callerRole() resolves
const SUPERADMIN = "uid-superadmin";
const ADMIN = "uid-admin";
const PASTOR = "uid-pastor";
const LEADER = "uid-leader";
const MEMBER = "uid-member";
const OTHER = "uid-other-member";

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(resolve(__dirname, "../firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  // Seed the role docs the rules' get() calls depend on.
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "users", SUPERADMIN), { role: "SUPERADMIN", email: "sa@x.co", emailVerified: true });
    await setDoc(doc(db, "users", ADMIN), { role: "ADMIN", email: "a@x.co", emailVerified: true });
    await setDoc(doc(db, "users", PASTOR), { role: "PASTOR", email: "p@x.co", emailVerified: true });
    await setDoc(doc(db, "users", LEADER), { role: "LEADER", email: "l@x.co", emailVerified: true });
    await setDoc(doc(db, "users", MEMBER), { role: "MEMBER", email: "m@x.co", emailVerified: true });
    await setDoc(doc(db, "users", OTHER), { role: "MEMBER", email: "o@x.co", emailVerified: true });
  });
});

// context helpers
const anon = () => testEnv.unauthenticatedContext().firestore();
const as = (uid: string) => testEnv.authenticatedContext(uid).firestore();
const seed = (fn: (db: any) => Promise<void>) =>
  testEnv.withSecurityRulesDisabled((ctx) => fn(ctx.firestore()));

describe("users", () => {
  it("anonymous cannot read a user doc", async () => {
    await assertFails(getDoc(doc(anon(), "users", MEMBER)));
  });

  it("member can read their own doc", async () => {
    await assertSucceeds(getDoc(doc(as(MEMBER), "users", MEMBER)));
  });

  it("member cannot read another member's doc", async () => {
    await assertFails(getDoc(doc(as(MEMBER), "users", OTHER)));
  });

  it("admin can read any user doc", async () => {
    await assertSucceeds(getDoc(doc(as(ADMIN), "users", OTHER)));
  });

  it("signed-in member can list users (directory)", async () => {
    await assertSucceeds(getDocs(collection(as(MEMBER), "users")));
  });

  it("anonymous cannot list users", async () => {
    await assertFails(getDocs(collection(anon(), "users")));
  });

  it("new signup can create own doc as MEMBER", async () => {
    const uid = "fresh-signup";
    await assertSucceeds(setDoc(doc(as(uid), "users", uid), { role: "MEMBER", email: "f@x.co" }));
  });

  it("new signup cannot self-assign a privileged role at creation", async () => {
    const uid = "sneaky-signup";
    await assertFails(setDoc(doc(as(uid), "users", uid), { role: "ADMIN", email: "s@x.co" }));
  });

  it("member can update their own profile fields", async () => {
    await assertSucceeds(updateDoc(doc(as(MEMBER), "users", MEMBER), { bio: "Hello", phone: "123" }));
  });

  it("member CANNOT escalate their own role", async () => {
    await assertFails(updateDoc(doc(as(MEMBER), "users", MEMBER), { role: "ADMIN" }));
  });

  it("member cannot change their own departmentIds", async () => {
    await assertFails(updateDoc(doc(as(MEMBER), "users", MEMBER), { departmentIds: ["dept1"] }));
  });

  it("admin can change a member's role", async () => {
    await assertSucceeds(updateDoc(doc(as(ADMIN), "users", MEMBER), { role: "LEADER" }));
  });

  it("member cannot delete a user doc; admin can", async () => {
    await assertFails(deleteDoc(doc(as(MEMBER), "users", OTHER)));
    await assertSucceeds(deleteDoc(doc(as(ADMIN), "users", OTHER)));
  });
});

describe("public content (sermons/events/devotionals)", () => {
  beforeEach(async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "sermons", "s1"), { title: "Grace" });
      await setDoc(doc(db, "events", "e1"), { title: "Retreat" });
      await setDoc(doc(db, "devotionals", "d1"), { title: "Daily" });
    });
  });

  it("anonymous can read sermons and events", async () => {
    await assertSucceeds(getDoc(doc(anon(), "sermons", "s1")));
    await assertSucceeds(getDoc(doc(anon(), "events", "e1")));
  });

  it("member cannot write sermons", async () => {
    await assertFails(setDoc(doc(as(MEMBER), "sermons", "s2"), { title: "Nope" }));
  });

  it("pastor can write sermons", async () => {
    await assertSucceeds(setDoc(doc(as(PASTOR), "sermons", "s3"), { title: "Faith" }));
  });

  it("admin can write events", async () => {
    await assertSucceeds(setDoc(doc(as(ADMIN), "events", "e2"), { title: "Vigil" }));
  });
});

describe("announcements (leader+ write)", () => {
  it("anonymous can read", async () => {
    await seed((db) => setDoc(doc(db, "announcements", "a1"), { title: "Notice" }));
    await assertSucceeds(getDoc(doc(anon(), "announcements", "a1")));
  });

  it("member cannot create; leader can", async () => {
    await assertFails(setDoc(doc(as(MEMBER), "announcements", "a2"), { title: "x" }));
    await assertSucceeds(setDoc(doc(as(LEADER), "announcements", "a3"), { title: "y" }));
  });
});

describe("media (public-only client read)", () => {
  beforeEach(async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "media", "pub"), { isPublic: true, url: "u" });
      await setDoc(doc(db, "media", "priv"), { isPublic: false, url: "u" });
    });
  });

  it("anyone can read public media", async () => {
    await assertSucceeds(getDoc(doc(anon(), "media", "pub")));
  });

  it("non-admin cannot read non-public media", async () => {
    await assertFails(getDoc(doc(as(MEMBER), "media", "priv")));
  });

  it("admin can read non-public media", async () => {
    await assertSucceeds(getDoc(doc(as(ADMIN), "media", "priv")));
  });
});

describe("donations (own-read, no client write)", () => {
  beforeEach(async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "donations", "don1"), { userId: MEMBER, donorId: MEMBER, amount: 5000, status: "COMPLETED" });
    });
  });

  it("anonymous cannot read donations", async () => {
    await assertFails(getDoc(doc(anon(), "donations", "don1")));
  });

  it("member can read their own donation", async () => {
    await assertSucceeds(getDoc(doc(as(MEMBER), "donations", "don1")));
  });

  it("member cannot read someone else's donation", async () => {
    await assertFails(getDoc(doc(as(OTHER), "donations", "don1")));
  });

  it("admin can read any donation", async () => {
    await assertSucceeds(getDoc(doc(as(ADMIN), "donations", "don1")));
  });

  it("no client can write a donation (server-only)", async () => {
    await assertFails(setDoc(doc(as(MEMBER), "donations", "don2"), { userId: MEMBER, amount: 1 }));
    await assertFails(setDoc(doc(as(ADMIN), "donations", "don3"), { userId: MEMBER, amount: 1 }));
  });
});

describe("notifications", () => {
  beforeEach(async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "notifications", "n1"), { userId: MEMBER, title: "Hi", read: false });
    });
  });

  it("member reads own notification; not others'", async () => {
    await assertSucceeds(getDoc(doc(as(MEMBER), "notifications", "n1")));
    await assertFails(getDoc(doc(as(OTHER), "notifications", "n1")));
  });

  it("member can mark own notification read", async () => {
    await assertSucceeds(updateDoc(doc(as(MEMBER), "notifications", "n1"), { read: true }));
  });

  it("member cannot edit other fields of own notification", async () => {
    await assertFails(updateDoc(doc(as(MEMBER), "notifications", "n1"), { title: "Hacked" }));
  });

  it("member cannot create notifications (admin/server only)", async () => {
    await assertFails(setDoc(doc(as(MEMBER), "notifications", "n2"), { userId: MEMBER, title: "x", read: false }));
  });
});

describe("prayer requests", () => {
  beforeEach(async () => {
    await seed((db) => setDoc(doc(db, "prayerRequests", "pr1"), { requestedBy: { id: MEMBER }, title: "Pray" }));
  });

  it("anonymous cannot read; signed-in can", async () => {
    await assertFails(getDoc(doc(anon(), "prayerRequests", "pr1")));
    await assertSucceeds(getDoc(doc(as(OTHER), "prayerRequests", "pr1")));
  });

  it("owner can update; non-owner cannot", async () => {
    await assertSucceeds(updateDoc(doc(as(MEMBER), "prayerRequests", "pr1"), { title: "Updated" }));
    await assertFails(updateDoc(doc(as(OTHER), "prayerRequests", "pr1"), { title: "Nope" }));
  });
});

describe("default deny", () => {
  it("an unmatched collection is denied even for admins", async () => {
    await assertFails(getDoc(doc(as(ADMIN), "secretStuff", "x")));
    await assertFails(setDoc(doc(as(ADMIN), "secretStuff", "x"), { a: 1 }));
  });
});
