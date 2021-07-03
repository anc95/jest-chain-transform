const { add, c } = require('./add');

describe('test transformer', () => {
  it('c should be 1', () => {
    expect(c).toBe(1);
  })
  it('add(1, 1) should be 2', () => {
    expect(add(1, 1)).toBe(2);
  })
});