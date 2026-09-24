import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      pwaAssets: {
        image: 'public/logo.svg',
        preset: 'minimal-2023',
        includeHtmlHeadLinks: true,
        overrideManifestIcons: true,
      },
      manifest: {
        id: '/',
        name: 'Mis Labores',
        short_name: 'Mis Labores',
        description: 'Cuenta puntos, vueltas y colores de tus labores: bordado, ganchillo y punto.',
        lang: 'es',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#F4EFE6',
        theme_color: '#F4EFE6',
        categories: ['lifestyle', 'productivity'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    restoreMocks: true,
  },
});
