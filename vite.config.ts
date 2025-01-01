import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    host: true, // or you can specify a custom IP address here, like '192.168.1.100'
  },

  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
