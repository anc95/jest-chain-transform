module.exports = {
  transform: {
    '\\.[jt]sx?$': [
      require.resolve('../../../dist/index.cjs'),
      {
        transformers: [require.resolve('./myTransformer.cjs'), 'babel-jest'],
      },
    ],
  },
  testMatch: ['**/*.test.js'],
};
