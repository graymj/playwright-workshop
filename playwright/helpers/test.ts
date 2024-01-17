import { test as base, expect as baseExpect, Page } from '@playwright/test';
import { Mock, MOCK_DIR } from './mock';

export const test = base.extend<{ rootURL: string, mock: Mock, MOCK_DIR: string }>({
  rootURL: process.env.CI ? '/playwright-workshop' : '/',
  MOCK_DIR,
  mock: async ({ page, MOCK_DIR }, use) => {
    const mock = new Mock(page, MOCK_DIR);
    await use(mock);
  }
});
