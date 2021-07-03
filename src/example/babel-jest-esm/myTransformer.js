module.exports = {
  getCacheKey: () => {
    return 'abc'
  },
  process: (sourceText, sourcePath) => {
    if (sourcePath.endsWith('add.js')) {
      return {
        code: `export const c=1;${sourceText}`
      }
    }

    return {
      code: sourceText
    }
  }
}