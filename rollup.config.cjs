const { readFileSync } = require('fs');
const esbuild = require('rollup-plugin-esbuild').default;
const dts = require('rollup-plugin-dts').default;
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

// The library is dependency-free and uses only universal JS, so nothing is
// external — every output is a self-contained, tree-shakeable bundle.
const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

// es2019 keeps the output readable and widely compatible (all modern browsers,
// Node 18+, Bun, Deno) while letting consumers' bundlers tree-shake the ESM.
const codePlugins = ({ minify = false } = {}) => [
  resolve({ extensions: ['.ts', '.js'] }),
  commonjs(),
  esbuild({ target: 'es2019', tsconfig: './tsconfig.json', sourceMap: true, minify }),
];

module.exports = [
  // ESM build — primary entry for bundlers, Node, Bun, Deno. Preserves named
  // exports so unused functions are dropped (with "sideEffects": false).
  {
    input: 'src/index.ts',
    output: { file: 'dist/index.mjs', format: 'es', sourcemap: true },
    external,
    plugins: codePlugins(),
  },
  // CommonJS build — for `require()` consumers on legacy Node toolchains.
  {
    input: 'src/index.ts',
    output: { file: 'dist/index.cjs', format: 'cjs', sourcemap: true, exports: 'named' },
    external,
    plugins: codePlugins(),
  },
  // Minified UMD build — for direct browser `<script>` / CDN use, exposing the
  // global `buildUrl`. Served via the package's unpkg/jsdelivr fields.
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'buildUrl',
      sourcemap: true,
      exports: 'named',
    },
    external,
    plugins: codePlugins({ minify: true }),
  },
  // Type declarations — emitted to the three extensions the exports map needs
  // so the "import" and "require" conditions each resolve unambiguous types.
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.d.ts', format: 'es' },
      { file: 'dist/index.d.mts', format: 'es' },
      { file: 'dist/index.d.cts', format: 'es' },
    ],
    plugins: [dts()],
  },
];
