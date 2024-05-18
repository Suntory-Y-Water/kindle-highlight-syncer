import { defineConfig } from 'vite';
import { crx, defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'kindle-highlight-syncer',
  version: '1.0.0',
  description:
    'Kindle Highlight Syncerは、Kindleでハイライトした内容をNotionへ連携するGoogle Chrome拡張機能です。',
  permissions: ['tabs', 'activeTab', 'scripting'],
  background: {
    service_worker: 'src/background.ts',
  },
  content_scripts: [
    {
      matches: ['https://read.amazon.co.jp/notebook'],
      js: ['src/content.ts'],
    },
  ],
  action: {
    default_popup: 'popup.html',
  },
});

export default defineConfig({
  plugins: [crx({ manifest })],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
