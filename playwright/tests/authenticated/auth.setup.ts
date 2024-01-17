import { test } from "../../helpers/test";
import { MOCK_DIR } from "../../helpers/mock";
import { wait } from "../../helpers/timer";

type SameSite = 'Strict' | 'Lax' | 'None';
const domain = process.env.CI ? 'danielstclair.github.io' : 'localhost';
const path = process.env.CI ? '/playwright-workshop' : '/';
const testCookie = {
  name: 'user_token',
  value: `%7B%22id%22%3A55%2C%22name%22%3A%22Michael%20Scott%22%2C%22gender%22%3A%22Male%22%2C%22marital%22%3A%22Holly%20Flax%22%2C%22job%22%3A%5B%22Regional%20Manager%22%2C%22Co-Regional%20Manager%20(former)%22%2C%22Salesman%20(former)%22%2C%22Founder%20and%20CEO%20(former)%22%2C%22Shareholder%20(former)%22%2C%22Cutlery%20Salesman%20(former)%22%2C%22Greeter%20(former)%22%2C%22Telemarketer%20(former)%22%5D%2C%22workplace%22%3A%5B%22Dunder%20Mifflin%20Scranton%22%2C%22The%20Michael%20Scott%20Paper%20Company%22%2C%22WUPHF.com%20(Website)%22%2C%22Arby's%22%2C%22Men's%20Warehouse%22%2C%22Lipophedrine%20Diet%20Pill%20Company%22%5D%2C%22firstAppearance%22%3A%22Pilot%22%2C%22lastAppearance%22%3A%22Finale%22%2C%22actor%22%3A%22Steve%20Carell%22%7D`,
  domain,
  path,
  expires: -1,
  httpOnly: false,
  secure: false,
  sameSite: 'Lax' as SameSite,
};

test('setups up auth by logging in', async ({ page, rootURL, mock }) => {
  await mock.route({ outputFile: `home/auth.har`, url: '**/api/**' })

  await page.goto(rootURL);
  const signInButton = page.getByRole('button', { name: 'Sign In' })
  await signInButton.click();
  page.getByText('Welcome, Michael Scott').isVisible();
  await page.context().addCookies([testCookie]);
  await page.context().storageState({ path: './playwright/.auth/auth.json' })
  await wait(2000);
})
