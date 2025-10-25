import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'components/WeatherSearch.jsx'
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
    },
  },
};

export default createJestConfig(config);
