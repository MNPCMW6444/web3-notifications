import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/dashboard',
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  server: {
    port: 3500,
    host: '127.0.0.1',
  },

  preview: {
    port: 4301,
    host: '127.0.0.1',
  },

  plugins: [react(), nxViteTsPaths(),inject({
    Buffer: ['buffer', 'Buffer'],
  })],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/apps/dashboard',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions:{external:["@the-libs/base-frontend"]}
  },
});
