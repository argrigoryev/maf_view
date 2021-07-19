// eslint-disable-next-line
import resolve from '@rollup/plugin-node-resolve';
// eslint-disable-next-line
import babel from '@rollup/plugin-babel';

export default {
  input: 'app.js',
  output: [
    {
      format: 'cjs',
      file: 'bundle.js',
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
