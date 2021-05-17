import typescript from 'rollup-plugin-typescript2';
import { resolve } from 'path';
import { main, module, dependencies } from './package.json';

export default {
  input: 'source/index.ts',
  output: [
    {
      file: resolve(main),
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: resolve(module),
      format: 'es',
    },
  ],
  external: ['path', 'events', 'fs', ...Object.keys(dependencies)],
  plugins: [typescript()],
};
