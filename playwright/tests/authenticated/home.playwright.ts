import { test, expect, Page } from '@playwright/test';
import { wait } from '../../helpers/timer';


test.describe('authenticated home page', () => {
  test('shows user info when logged in', async ({ page }) => {
    test.setTimeout(10000);
    await page.goto('/');
    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    expect(signOutButton).toBeVisible({ timeout: 10000 });
    expect(page.getByText('Welcome, Michael Scott')).toBeVisible();
    expect(page.getByTestId('company')).toBeVisible();
    expect(page.getByTestId('position')).toBeVisible();
  });
  test('shows coworkers when logged in', async ({ page }) => {
    test.setTimeout(10000);
    await page.goto('/');

    await wait(2000);
    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    expect(signOutButton).toBeVisible({ timeout: 10000 });
    expect(page.getByText('Welcome, Michael Scott')).toBeVisible();
    const coworkerSection = page.getByTestId('coworkers-section');
    expect(coworkerSection).toBeVisible({ timeout: 10000 });
    expect(coworkerSection.getByText('Coworkers')).toBeVisible();
    expect(coworkerSection.getByText('Dwight Schrute')).toBeVisible({ timeout: 10000 });
  });
  test('can sign out', async ({ page }) => {
    test.setTimeout(10000);
    await page.goto('/');
    await wait(2000);
    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    expect(signOutButton).toBeVisible({ timeout: 10000 });
    const coworkersSection = page.getByTestId('coworkers-section');
    expect(coworkersSection).toBeVisible();
    const dwightSchrute = coworkersSection.getByText('Dwight Schrute');
    expect(dwightSchrute).toBeVisible();
    await signOutButton.click();
    await wait(2000);

    const signInButton = page.getByRole('button', { name: 'Sign In' })
    expect(signInButton).toBeVisible();
    expect(coworkersSection).not.toBeVisible();
    expect(dwightSchrute).not.toBeVisible();
  });
});

