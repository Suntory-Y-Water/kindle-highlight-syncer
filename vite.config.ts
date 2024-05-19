import { defineConfig } from 'vite';
import { crx, defineManifest } from '@crxjs/vite-plugin';
import { PluginOption } from 'vite';

// Pluginは非推奨のため、PluginOptionを使う
// ビルド時にエラーが発生してしまうため、Issueを参考に対応
const viteManifestHackIssue846: PluginOption & {
  renderCrxManifest: (manifest: any, bundle: any) => void;
} = {
  // Workaround from https://github.com/crxjs/chrome-extension-tools/issues/846#issuecomment-1861880919.
  name: 'manifestHackIssue846',
  renderCrxManifest(_manifest, bundle) {
    bundle['manifest.json'] = bundle['.vite/manifest.json'];
    bundle['manifest.json'].fileName = 'manifest.json';
    delete bundle['.vite/manifest.json'];
  },
};

const manifest = defineManifest({
  manifest_version: 3,
  name: 'KinNo アシスタント',
  version: '1.0.0',
  description: 'Kindleでハイライトした内容をNotionへ連携するGoogle Chrome拡張機能です。',
  permissions: ['tabs', 'activeTab', 'scripting'],
  icons: {
    '128': 'public/icon.png',
  },
  background: {
    service_worker: 'src/background.ts',
  },
  content_scripts: [
    {
      matches: ['https://read.amazon.co.jp/notebook*'],
      js: ['src/content.ts'],
    },
  ],
  action: {
    default_popup: 'popup.html',
  },
  host_permissions: ['https://api.notion.com/v1/*'],
});

export default defineConfig({
  plugins: [viteManifestHackIssue846, crx({ manifest })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
