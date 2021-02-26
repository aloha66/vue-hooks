import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

console.log("resolve(__dirname, 'test')", resolve(__dirname, 'test'));

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  },
  plugins: [vue()],
});
