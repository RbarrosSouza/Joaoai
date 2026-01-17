import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      build: {
        // A Vercel mostra warning quando algum chunk passa de 500kb minificado.
        // Preferimos resolver dividindo o bundle (melhora performance) e ainda
        // elevamos o limite para reduzir ruído em builds.
        chunkSizeWarningLimit: 900,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (!id.includes('node_modules')) return;
              if (id.includes('recharts') || id.includes('victory')) return 'charts';
              if (id.includes('lucide-react')) return 'icons';
              // Deixa o restante para a estratégia padrão do Rollup/Vite,
              // evitando ciclos (ex.: react <-> vendor) e chunks vazios.
            },
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
