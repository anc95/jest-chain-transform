import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default {
  transform: {
    '\\.[jt]sx?$': [
      require.resolve('../../../dist/index.cjs'),
      {
        transformers: [require.resolve('./myTransformer.mjs'), 'babel-jest'],
      },
    ],
  },
  testMatch: ['**/*.test.js'],
};
