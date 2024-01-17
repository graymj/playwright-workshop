import { test } from '../../helpers/test';
import { expect } from '@playwright/test';
import { wait } from '../../helpers/timer';
import { MOCK_DIR } from '../../helpers/mock';


test.describe('authenticated home page', () => {
  test('shows user info when logged in', async ({ page, rootURL }) => {
    test.setTimeout(10000);
    await page.routeFromHAR(`${MOCK_DIR}/home/home.har`, {
      url: '**/api/**',
      update: false
    })
    console.log({ rootURL })
    await page.goto(rootURL);
    await wait(1000);
    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    expect(signOutButton).toBeVisible({ timeout: 10000 });
    expect(page.getByText('Welcome, Michael Scott')).toBeVisible();
    expect(page.getByTestId('company')).toBeVisible();
    expect(page.getByTestId('position')).toBeVisible();
  });
  test('shows coworkers when logged in', async ({ page, rootURL }) => {
    test.setTimeout(10000);
    await page.routeFromHAR(`${MOCK_DIR}/home/home.har`, {
      url: '**/api/**',
      update: false
    })
    await page.goto(rootURL);

    await wait(1000);
    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    expect(signOutButton).toBeVisible({ timeout: 10000 });
    expect(page.getByText('Welcome, Michael Scott')).toBeVisible();
    const coworkerSection = page.getByTestId('coworkers-section');
    expect(coworkerSection).toBeVisible({ timeout: 10000 });
    expect(coworkerSection.getByText('Coworkers')).toBeVisible();
    expect(coworkerSection.getByText('Dwight Schrute')).toBeVisible({ timeout: 10000 });
  });
  test('can sign out', async ({ page, rootURL }) => {
    test.setTimeout(10000);
    await page.routeFromHAR(`${MOCK_DIR}/home/home.har`, {
      url: '**/api/**',
      update: false
    })
    await page.goto(rootURL);
    await wait(1000);
    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    expect(signOutButton).toBeVisible({ timeout: 10000 });
    const coworkersSection = page.getByTestId('coworkers-section');
    expect(coworkersSection).toBeVisible();
    const dwightSchrute = coworkersSection.getByText('Dwight Schrute');
    expect(dwightSchrute).toBeVisible();
    await signOutButton.click();
    await wait(1000);

    const signInButton = page.getByRole('button', { name: 'Sign In' })
    expect(signInButton).toBeVisible();
    expect(coworkersSection).not.toBeVisible();
    expect(dwightSchrute).not.toBeVisible();
  });
});

