import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';

const plugins = [json(), builtins(), resolve(), commonjs()];

const config = [
  {
    input: 'lib/common-js-modules.js',
    output: {
      format: 'es',
      file: 'lib/common-js-modules.esm.js',
      sourcemap: true
    },
    plugins
  }
];

export default config;
