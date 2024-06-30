import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ tsDecorators: true })],
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
        },
      },
    },
  },
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     esbuildOptions: {
//       tsconfigRaw: {
//         compilerOptions: {
//           experimentalDecorators: true,
//         },
//       },
//     },
//   },
// });
