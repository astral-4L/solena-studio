import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    // RLS tests share one database; run them serially to keep fixtures predictable.
    fileParallelism: false,
  },
});
