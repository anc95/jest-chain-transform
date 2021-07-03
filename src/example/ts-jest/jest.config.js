module.exports = {
  transform: {"\\.[jt]sx?$": [
    require.resolve('../../../lib'),
    {
      transformers: [require.resolve('./myTransformer.js'), 'ts-jest']
    }
  ]},
  testMatch: ['**/*.test.ts']
}