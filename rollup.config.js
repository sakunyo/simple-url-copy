// rollup.config.js
//
import typescript from '@rollup/plugin-typescript';

export default [
  'src/contentscript.ts',
  'src/background.ts',
  'src/popup.ts',
].map(input => ({
  input,
  output: {
    dir: 'dest/',
    format: 'iife',
  },
  watch: {
    include: 'src/**/*.*',
  },
  plugins: [typescript()],
}));
