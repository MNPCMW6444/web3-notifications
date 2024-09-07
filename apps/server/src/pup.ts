import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer');
const os = require('os');

export const xxw = async () => {
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
    await page.goto('https://example.com');

    // Your Puppeteer code here

    await browser.close();
    console.log('closed good');
  } catch (error) {
    console.error('Failed to launch browser:', error);
  }
};

const avveURL =
  'http://aave:80/reserve-overview/?underlyingAsset=0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee&marketName=proto_mainnet_v3';

const swapURL =
  'http://swap:80/?chain=ethereum&from=0xdac17f958d2ee523a2206206994597c13d831ec7&tab=swap&to=0x4c9edd5852cd905f086c759e8383e09bff1e68b3';
