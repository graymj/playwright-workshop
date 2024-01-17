import { test, expect } from '@playwright/test';
import { wait } from '../helpers/timer';

test.describe('authentication', () => {
  test('does not show user info when not logged in', async ({ page }) => {
    test.setTimeout(10000);
    await page.goto('/');
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    expect(signInButton).toBeVisible();
    expect(page.getByText('Welcome, please sign in.')).toBeVisible();
    expect(page.getByTestId('company')).not.toBeVisible();
    expect(page.getByTestId('position')).not.toBeVisible();
    expect(page.getByTestId('coworkers-section')).not.toBeVisible();
  });
  test('shows user info when logged in', async ({ page }) => {
    test.setTimeout(10000);
    await page.goto('/');
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    await signInButton.click();
    await wait(2000);
    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    expect(signOutButton).toBeVisible({ timeout: 10000 });
    expect(page.getByText('Welcome, Michael Scott')).toBeVisible();
    expect(page.getByTestId('company')).toBeVisible();
    expect(page.getByTestId('position')).toBeVisible();
  });
  test('shows coworkers when logged in', async ({ page }) => {
    test.setTimeout(10000);
    await page.goto('/');
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    await signInButton.click();
    await wait(2000);
    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    expect(signOutButton).toBeVisible({ timeout: 10000 });
    expect(page.getByText('Welcome, Michael Scott')).toBeVisible();
    const coworkerSection = page.getByTestId('coworkers-section');
    expect(coworkerSection).toBeVisible();
    expect(coworkerSection.getByText('Coworkers')).toBeVisible();
    expect(coworkerSection.getByText('Dwight Schrute')).toBeVisible();
  });
  test('can sign out', async ({ page }) => {
    test.setTimeout(10000);
    await page.goto('/');
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    await signInButton.click();
    await wait(2000);
    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    expect(signOutButton).toBeVisible({ timeout: 10000 });
    expect(page.getByText('Welcome, Michael Scott')).toBeVisible();
    const coworkerSection = page.getByTestId('coworkers-section');
    expect(coworkerSection).toBeVisible();
    expect(coworkerSection.getByText('Coworkers')).toBeVisible();
    expect(coworkerSection.getByText('Dwight Schrute')).toBeVisible();
    signOutButton.click();
    await wait(2000);
    expect(signInButton).toBeVisible();
    expect(page.getByText('Welcome, please sign in.')).toBeVisible();
    expect(page.getByTestId('company')).not.toBeVisible();
    expect(page.getByTestId('position')).not.toBeVisible();
    expect(page.getByTestId('coworkers-section')).not.toBeVisible();
  });
});
