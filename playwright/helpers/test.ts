import { test as base, expect as baseExpect, Page } from '@playwright/test';

export const test = base.extend<{ rootURL: string }>({
  rootURL: process.env.CI ? '/playwright-workshop' : '/'
});
