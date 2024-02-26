module.exports = {
  getCacheKey: () => {
    return 'abc'
  },
  process: (sourceText, sourcePath) => {
    console.log(sourcePath)
    if (sourcePath.endsWith('add.ts')) {
      return `export const c = 1;${sourceText}`;
    }

    return sourceText;
  }
}