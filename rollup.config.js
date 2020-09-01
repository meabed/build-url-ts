// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import {uglify} from "rollup-plugin-uglify";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: './src/build-url.ts',
  output: {
    sourcemap: true,
    dir: 'dist',
    name: 'build-url',
    format: 'cjs',
    exports: 'named',
  },
  plugins: [
    typescript({
      //default use tsconfig.json but can be ovverride here
      //typescript: require('some-typescript-fork') //default use TS 1.8.9 but can use other specific compiler version/fork
    }),
    resolve({ //used to resolve NPM module reading from packages.json those entrypoint (ES6 - Main or Browser specific)
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(), //translate commonjs module to ES6 module to be handle from Rollup and tree-shake
    replace({ //enable find-replacing variable in JS code to use ENV varibale for conditional code
      ENV: JSON.stringify(process.env.NODE_ENV || "development") // key = var name, value = replace
    }),
    (process.env.NODE_ENV === "production" && uglify())
  ]
};
