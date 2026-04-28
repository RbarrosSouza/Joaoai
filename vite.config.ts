import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function supabasePreconnect(supabaseUrl?: string): Plugin {
  let host: string | null = null;
  try {
    if (supabaseUrl) host = new URL(supabaseUrl).origin;
  } catch {
    host = null;
  }
  return {
    name: 'supabase-preconnect',
    transformIndexHtml(html) {
      if (!host) return html;
      const tags = `\n    <link rel="preconnect" href="${host}" crossorigin>\n    <link rel="dns-prefetch" href="${host}">`;
      return html.replace('</head>', `${tags}\n  </head>`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), supabasePreconnect(env.VITE_SUPABASE_URL)],
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
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('recharts') || id.includes('victory')) return 'charts';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('@supabase')) return 'supabase';
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
