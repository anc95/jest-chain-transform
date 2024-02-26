module.exports = {
  getCacheKey: () => {
    return 'abc';
  },
  process: (sourceText) => {
    return {
      code: `exports.c=1;${sourceText}`,
    };
  },
};
