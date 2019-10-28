const puppeteer = require('puppeteer');
const path = require('path');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

const launchServer = require('./lib/run-server');

async function test() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let error;
  let pixelDifference;

  const server = await launchServer();
  try {
    page.on('console', msg => {
      if (msg.type() === 'error') throw new Error(msg.text());
    });
    page.on('pageerror', err => {
      throw err;
    });

    await page.goto(`http://127.0.0.1:${server.address().port}`, {
      waitUntil: 'networkidle2',
    });
    await page.setViewport({ width: 640, height: 1000 });
    await page.click('label[for="choices-single-custom-templates"]');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    const artifactsPath = 'screenshot';
    mkdirSync(artifactsPath, { recursive: true });
    const imageBuffer = await page.screenshot({
      path: path.join(artifactsPath, 'screenshot.png'),
      fullPage: true,
    });

    // compare with snapshot
    const screenshot = PNG.sync.read(imageBuffer);
    const snapshot = PNG.sync.read(
      readFileSync(
        path.resolve(
          __dirname,
          `./__snapshots__/puppeteer-${process.platform}.png`,
        ),
      ),
    );
    const { width, height } = screenshot;
    const diff = new PNG({ width, height });
    pixelDifference = pixelmatch(
      screenshot.data,
      snapshot.data,
      diff.data,
      width,
      height,
      {
        threshold: 0.6,
      },
    );
    writeFileSync(path.join(artifactsPath, 'diff.png'), PNG.sync.write(diff));
  } catch (err) {
    console.error(err);
    error = err;
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

setImmediate(test);
