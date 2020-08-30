// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/build-url.ts',
  output: {
    sourcemap: true,
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [typescript()]
};
