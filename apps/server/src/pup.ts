import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer');
const os = require('os');

export const goSomeWhereAndWait = async (
  whereTo: string,
  howLong: number = 30,
) => {
  let launchOptions: any = {
    args: [
      '--no-sandbox', // Required for running in Docker/Linux
      '--disable-setuid-sandbox', // Required for running in Docker/Linux
      '--disable-dev-shm-usage', // Prevents issues in Docker environments
      '--single-process', // Optimize for Docker and M1
    ],
  };

  const platform = os.platform();

  // Set the Chrome executable path based on the platform
  if (platform === 'darwin') {
    // For macOS (M1), use Google Chrome Canary
    launchOptions.executablePath =
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary';
  } else if (platform === 'linux') {
    // For Linux, use the default Puppeteer Chromium or the system-installed Chrome
    launchOptions.executablePath = '/usr/bin/google-chrome'; // Modify if Chrome is installed in a different path
  } else {
    console.error(`Unsupported platform: ${platform}`);
    process.exit(1);
  }

  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.goto(whereTo);

    setTimeout(
      () => browser.close().then(() => console.log('closed good')),
      howLong * 1000,
    );
  } catch (error) {
    console.error('Failed to launch browser:', error);
  }
};
