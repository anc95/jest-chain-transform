# jest-chain-transform
[![Node.js Package](https://github.com/anc95/jest-chain-transform/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/anc95/jest-chain-transform/actions/workflows/npm-publish.yml)
[![Node.js CI](https://github.com/anc95/jest-chain-transform/actions/workflows/node.js.yml/badge.svg)](https://github.com/anc95/jest-chain-transform/actions/workflows/node.js.yml)

`jest-chain-transform` enables jest can transform file by mutiple transformers.

## install

npm
```sh
npm install jest-chain-transform -D
```

yarn
```sh
yarn add jest-chain-transform -D
```

## config
```js
// jest.config.js
module.exports = {
  transform: {
    "\\.[jt]sx?$": [
      'jest-chain-transform'
      {
        transformers: [
          'path-of-your-custom-transformer', 'ts-jest'
        ]
      }
    ]
  },
}
```

Jest will transform all files that match `\\.[jt]sx?$` by `path-of-your-custom-transformer` and `'ts-jest'` in turn.

If you need to pass extra option to transform, you can write config as follow

```js
// jest.config.js
module.exports = {
  transform: {
    "\\.[jt]sx?$": [
      'jest-chain-transform'
      {
        transformers: [
          ['path-of-your-custom-transformer', { ... }],
          ['babel-jest', { ... }]
        ]
      }
    ]
  },
}
```

## option

```ts
interface Config {
  /**
   * multiple transforms
   * @example
   * ```js
   * ['babel-jest', 'ts-jest']
   * [
   *   ['babel-jest', { }],
   *   ['ts-jest', { }]
   * ]
   * ```
   */
  transformers: string[] | [string, Record<string, any>][];
}
```
