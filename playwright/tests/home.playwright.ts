import { test as base, expect, Page } from '@playwright/test';
import { wait } from '../helpers/timer';

const signIn = async (page: Page) => {
  await page.goto('/');
  const signInButton = page.getByRole('button', { name: 'Sign In' })
  await signInButton.click();
  await wait(2000);
}

class HomePage {
  constructor(public page: Page) {}

  async signIn() {
    await signIn(this.page);
  }

  async signOut() {
    const signOutButton = this.page.getByRole('button', { name: 'Sign Out' })
    await signOutButton.click();
    await wait(2000);
  }

  async isSignedIn() {
    const signOutButton = this.page.getByRole('button', { name: 'Sign Out' })
    return signOutButton.isVisible();
  }

  async isSignedOut() {
    const signInButton = this.page.getByRole('button', { name: 'Sign In' })
    return signInButton.isVisible();
  }

  async getWelcomeMessage() {
    return this.page.getByText('Welcome, Michael Scott');
  }

  async getCompany() {
    return this.page.getByTestId('company');
  }

  async getPosition() {
    return this.page.getByTestId('position');
  }

  async getCoworkersSection() {
    return this.page.getByTestId('coworkers-section');
  }

  async getCoworkers(name: string) {
    const coworkerSection = await this.getCoworkersSection();
    return coworkerSection.getByText(name);
  }
}

const test = base.extend<{ signIn: () => Promise<void>, homePage: HomePage }>({
  signIn: async ({ page }, use) => {
    // This is run before each test.
    console.log('before each test');
    // This allows to use the signIn function in the test.
    use(async () => {
      await signIn(page);
    });
    // This is run after each test.
    console.log('after each test')
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  }
})

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
  test('shows user info when logged in', async ({ page, signIn }) => {
    test.setTimeout(10000);
    await signIn();
    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    expect(signOutButton).toBeVisible({ timeout: 10000 });
    expect(page.getByText('Welcome, Michael Scott')).toBeVisible();
    expect(page.getByTestId('company')).toBeVisible();
    expect(page.getByTestId('position')).toBeVisible();
  });
  test('shows coworkers when logged in', async ({ page, signIn }) => {
    test.setTimeout(10000);
    await signIn();

    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    expect(signOutButton).toBeVisible({ timeout: 10000 });
    expect(page.getByText('Welcome, Michael Scott')).toBeVisible();
    const coworkerSection = page.getByTestId('coworkers-section');
    expect(coworkerSection).toBeVisible();
    expect(coworkerSection.getByText('Coworkers')).toBeVisible();
    expect(coworkerSection.getByText('Dwight Schrute')).toBeVisible();
  });
  test('can sign out', async ({ signIn, homePage }) => {
    test.setTimeout(10000);
    await homePage.signIn();
    expect(await homePage.isSignedIn()).toBe(true);
    expect(await homePage.getCoworkersSection()).toBeVisible();
    expect(await homePage.getCoworkers('Dwight Schrute')).toBeVisible();
    await homePage.signOut();
    expect(await homePage.isSignedOut()).toBe(true);
    expect(await homePage.getCoworkersSection()).not.toBeVisible();
    expect(await homePage.getCoworkers('Dwight Schrute')).not.toBeVisible();
  });
});
