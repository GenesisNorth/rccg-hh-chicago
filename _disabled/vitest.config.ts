import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Rules tests talk to the Firestore emulator over the network — run serially,
    // node environment, generous timeout for emulator round-trips.
    include: ["__tests__/**/*.test.ts"],
    environment: "node",
    testTimeout: 15000,
    hookTimeout: 30000,
    fileParallelism: false,
  },
});
