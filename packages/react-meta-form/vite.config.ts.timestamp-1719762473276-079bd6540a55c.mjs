// vite.config.ts
import { defineConfig } from 'file:///Users/hyj/Desktop/personal/repos/monorepo-for-my-packages/node_modules/.pnpm/vite@5.3.2/node_modules/vite/dist/node/index.js';
import react from 'file:///Users/hyj/Desktop/personal/repos/monorepo-for-my-packages/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.0_vite@5.3.2/node_modules/@vitejs/plugin-react-swc/index.mjs';
import dts from 'file:///Users/hyj/Desktop/personal/repos/monorepo-for-my-packages/node_modules/.pnpm/vite-plugin-dts@3.9.1_typescript@5.5.2_vite@5.3.2/node_modules/vite-plugin-dts/dist/index.mjs';
var vite_config_default = defineConfig({
  plugins: [react({ tsDecorators: true }), dts({})],
  build: {
    lib: {
      entry: './src/index.tsx',
      name: 'react-meta-form',
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
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaHlqL0Rlc2t0b3AvcGVyc29uYWwvcmVwb3MvbW9ub3JlcG8tZm9yLW15LXBhY2thZ2VzL3BhY2thZ2VzL3JlYWN0LW1vZGVsLWJhc2UtZm9ybVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2h5ai9EZXNrdG9wL3BlcnNvbmFsL3JlcG9zL21vbm9yZXBvLWZvci1teS1wYWNrYWdlcy9wYWNrYWdlcy9yZWFjdC1tb2RlbC1iYXNlLWZvcm0vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2h5ai9EZXNrdG9wL3BlcnNvbmFsL3JlcG9zL21vbm9yZXBvLWZvci1teS1wYWNrYWdlcy9wYWNrYWdlcy9yZWFjdC1tb2RlbC1iYXNlLWZvcm0vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoeyB0c0RlY29yYXRvcnM6IHRydWUgfSksIGR0cyh7fSldLFxuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6ICcuL3NyYy9pbmRleC50c3gnLFxuICAgICAgbmFtZTogJ3JlYWN0LW1vZGVsLWJhc2UtZm9ybScsXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ2NqcyddLFxuICAgICAgZmlsZU5hbWU6ICdpbmRleC5qcycsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgcmVhY3Q6ICdSZWFjdCcsXG4gICAgICAgICAgJ3JlYWN0LWRvbSc6ICdSZWFjdERPTScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNmIsU0FBUyxvQkFBb0I7QUFDMWQsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUVoQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxFQUFFLGNBQWMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUFBLEVBQ2hELE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxNQUNyQixVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsV0FBVztBQUFBLE1BQy9CLFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxVQUNQLGFBQWE7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
