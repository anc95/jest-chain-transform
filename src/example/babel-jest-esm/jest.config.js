module.exports = {
  transform: {"\\.[jt]sx?$": [
    require.resolve('../../../lib'),
    {
      transformers: [require.resolve('./myTransformer.js'), 'babel-jest']
    }
  ]},
  testMatch: ['**/*.test.js']
}