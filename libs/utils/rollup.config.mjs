import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const plugins = [
  typescript({
    tsconfig: 'tsconfig.build.json',
  }),
  babel({ babelHelpers: 'bundled' }),
  commonjs(),
  peerDepsExternal(),
];

const rollup = [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
      preserveModules: true,
    },
    plugins,
    external: ['react', 'react/jsx-runtime', 'password-validator', 'papaparse'],
  },
];

export default rollup;
