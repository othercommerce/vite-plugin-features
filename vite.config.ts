import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
  build: {
    target: 'node20',
    lib: {
      entry: 'src/vite-plugin-features.ts',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vite', /^node:.*$/],
    },
  },
});
