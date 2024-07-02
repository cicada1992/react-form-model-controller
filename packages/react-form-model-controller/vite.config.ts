import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react({ tsDecorators: true }), dts({})],
  build: {
    lib: {
      entry: './src/index.tsx',
      name: 'react-form-model-controller',
      formats: ['es', 'cjs'],
      fileName: 'index.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
