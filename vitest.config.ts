import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './src/v2') }],
  },
  test: {
    environmentMatchGlobs: [['src/v2/http/controllers/**', 'prisma']],
  },
});
