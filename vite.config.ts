import { resolve } from 'path';
import { Plugin, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [
    react({
      plugins: [],
    }),
  ],
  resolve: {
    alias: [
      { find: '~', replacement: resolve('./src') },
    ],
  },
})
