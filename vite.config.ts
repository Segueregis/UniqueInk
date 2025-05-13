import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Expor a aplicação em todos os endereços possíveis
    port: 3000,       // Usar a porta 3000, ou qualquer outra porta que Render suporte
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
