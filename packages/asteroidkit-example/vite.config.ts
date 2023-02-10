/* eslint-disable */
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import react from '@vitejs/plugin-react-swc';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill(),
      ],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      http: 'rollup-plugin-node-polyfills/polyfills/http',

      path: 'rollup-plugin-node-polyfills/polyfills/path',

      https: 'rollup-plugin-node-polyfills/polyfills/http',

      punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',

      assert: 'rollup-plugin-node-polyfills/polyfills/assert',

      sys: 'util',

      _stream_duplex:
        'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',

      _stream_passthrough:
        'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
      // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
      // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
      util: 'rollup-plugin-node-polyfills/polyfills/util',
      _stream_readable:
        'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      _stream_transform:
        'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
      querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
      _stream_writable:
        'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
      url: 'rollup-plugin-node-polyfills/polyfills/url',
      console: 'rollup-plugin-node-polyfills/polyfills/console',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      os: 'rollup-plugin-node-polyfills/polyfills/os',
      constants: 'rollup-plugin-node-polyfills/polyfills/constants',
      domain: 'rollup-plugin-node-polyfills/polyfills/domain',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      timers: 'rollup-plugin-node-polyfills/polyfills/timers',
      tty: 'rollup-plugin-node-polyfills/polyfills/tty',
      vm: 'rollup-plugin-node-polyfills/polyfills/vm',
      zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
    },
  },
});
