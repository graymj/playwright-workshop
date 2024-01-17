import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// Change this to your dev URL
const devURL = 'https://danielstclair.github.io/playwright-workshop'
const localURL = 'http://localhost:3000'
export default defineConfig({
  testDir: './playwright/tests',
  testIgnore: './app/__tests__/',
  /* Run only x.e2e.ts files for playwright because Jest picks up x.spec.ts */
  testMatch: /.*\.playwright\.ts/,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['./playwright/helpers/reporter.ts'],
    ['dot'],
    ['html', { outputFolder: 'playwright-report/', open: false }],
    ['json', { outputFile: 'playwright-report/playwright-report.json' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* This lets us access dev url in CI without worrying about CERT file issues */
    contextOptions: {
      ignoreHTTPSErrors: true
    },
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CI ? devURL : localURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry'
  },
  // Remove this command in CI because we already have a web server runninghj
  ...(process.env.CI
    ? {}
    : {
        webServer: {
          // This is the command used to start the server in test mode.
          command: 'npm run dev',
          reuseExistingServer: !process.env.CI,
          url: localURL
        }
      }),

  /* Configure projects for major browsers */
  projects: [
    // Setup project
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'logged in chromium',
      use: { ...devices['Desktop Chrome'], storageState: './playwright/.auth/auth.json' },
      dependencies: ['setup'],
      testIgnore: 'playwright/tests/unauthenticated/**',
    },
    {
      name: 'logged out chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: 'playwright/tests/unauthenticated/**',
    }
  ]
})
