import { test } from '../../helpers/test'
import { expect } from '@playwright/test';

test.describe('unauthenticated home page', () => {
  test('does not show user info when not logged in', async ({ page, rootURL }) => {
    test.setTimeout(10000);
    await page.goto(rootURL);
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    expect(signInButton).toBeVisible();
    expect(page.getByText('Welcome, please sign in.')).toBeVisible();
    expect(page.getByTestId('company')).not.toBeVisible();
    expect(page.getByTestId('position')).not.toBeVisible();
    expect(page.getByTestId('coworkers-section')).not.toBeVisible();
  });
});