// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json'

export default {
  input: 'src/build-url.ts',
  output: {
    sourcemap: true,
    dir: 'dist',
    format: 'cjs'
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [typescript()]
};
