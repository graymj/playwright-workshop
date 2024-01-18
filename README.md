# Welcome to the Favor Engineering Workshop Extravaganza!

## Getting Started

To get the most out of this workshop, you'll first need to fork this repository to your own GitHub account. Then, clone the forked repository to your local machine.

Optionally, you'll want to fetch all the branches from the upstream repository:

```bash
git remote add upstream git@github.com:danielstclair/playwright-workshop.git
git fetch upstream --all
git branch -avv # You should see all the branches from the upstream repository
# To make a local branch track a remote branch:
git branch abranch --track upstream/abranch
git checkout abranch
git push -u origin abranch
```

After cloning the repository, you'll need to install the dependencies:

```bash
npm install
```

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Testing

First, run the test server:

```bash
npm run dev
```

Then, run the tests in a separate window:

```bash
npm run playwright -- --ui
```

## Learn More

Checkout the [Favor Playwright Documentation](https://favorengineering.atlassian.net/wiki/spaces/EN/pages/3746136067/Playwright+Recipes+and+Best+Practices) for more information.
