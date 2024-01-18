import { test, expect } from '@playwright/test'

test('Title exists', async({ page }) => {
  page.goto('/')
  // check for page title

  await expect(page).toHaveTitle(/Creat Next App/);
})

// export function wait(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }

test.describe('Home', () => {
  test('does not show user information when not logged in', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByText('Welcome, please sign in.')).toBeVisible({ timeout: 10000 })
      await expect(page.getByTestId('company')).not.toBeVisible()
      await expect(page.getByTestId('position')).not.toBeVisible()
      await expect(page.getByTestId('coworkers-section')).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    })
  test('shows user information when logged in', async ({ page }) => {
    await page.goto('/')
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    await signInButton.click()
    await page.waitForTimeout(1000)
    await expect(page.getByTestId('company')).toBeVisible()
    await expect(page.getByTestId('position')).toBeVisible()
    const coworkers = page.getByTestId('coworkers-list')
    await expect(coworkers.getByText('Dwight Schrute')).toBeVisible()
  })
  test('test user can logout', async ({ page }) => {
    await page.goto('/')
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    await signInButton.click()
    await page.waitForTimeout(1000)

    const signOutButton = page.getByRole('button', { name: 'Sign Out' })
    await signOutButton.click()
    await page.waitForTimeout(1000)
    await expect(page.getByText('Welcome, please sign in.')).toBeVisible({ timeout: 10000 })
  })
})