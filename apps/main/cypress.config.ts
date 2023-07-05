import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    video: false,
    viewportWidth: 1200,
    viewportHeight: 800,
    testIsolation: false,
    chromeWebSecurity: false,
    screenshotOnRunFailure: false,
    baseUrl: 'http://127.0.0.1:3000',
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@cypress/code-coverage/task')(on, config);

      return config;
    },
  },
  pageLoadTimeout: 10_000,
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
