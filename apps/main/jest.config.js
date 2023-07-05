function makeModuleNameMapper(srcPath, tsconfigPath) {
  const aliases = {};
  const { paths } = require(tsconfigPath).compilerOptions;

  Object.keys(paths).forEach((item) => {
    const key = item.replace('/*', '/(.*)');
    const path = paths[item][0].replace('/*', '/$1');
    aliases[key] = srcPath + '/' + path;
  });

  return aliases;
}

const ignoreCoverageFiles = [
  'src/utils/base-api.ts',
  'src/utils/create-emotion-cache.ts',
  'src/utils/get-server-side-session.ts',
  'src/utils/with-nonce.ts',
];
const SRC_PATH = '<rootDir>/src';
const TS_CONFIG_PATH = './tsconfig.json';

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    '@testing-library/react',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage-jest',
  collectCoverageFrom: ['src/utils/*.ts'],
  coveragePathIgnorePatterns: ignoreCoverageFiles,
  moduleNameMapper: makeModuleNameMapper(SRC_PATH, TS_CONFIG_PATH),
};
