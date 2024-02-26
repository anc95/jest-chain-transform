npx jest -c src/example/babel-jest-cjs/jest.config.cjs
NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" npx jest -c src/example/babel-jest-esm/jest.config.mjs
npx jest -c src/example/ts-jest/jest.config.cjs