const path = require('path');
const { once } = require('events');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

const express = require('express');
const {
  Builder,
  By,
  Key,
  until,
  WebDriver,
  Capabilities,
  Logs,
  logging,
} = require('selenium-webdriver');

const PORT = 3001;
async function launchServer() {
  const DIST_DIR = path.join(__dirname, '../../public');

  const app = express();
  app.use(express.static(DIST_DIR));

  const server = app.listen(PORT, err => {
    if (err) {
      console.log(err);
    }

    console.log(`Listening at http://localhost:${PORT} 👂`);
  });
  await once(server, 'listening');
  return server;
}

async function test() {
  let pixelDifference;
  let error;

  let capabilities;
  switch (process.env.BROWSER) {
    case 'ie':
      {
        // HACK: include IEDriver path by nuget
        // const driverPath = path.join(
        //   __dirname,
        //   '../Selenium.WebDriver.IEDriver.3.150.1/driver/',
        // );
        // process.env.PATH = `${process.env.PATH};${driverPath};`;
        capabilities = Capabilities.ie();
        capabilities.set('ignoreProtectedModeSettings', true);
        capabilities.set('ignoreZoomSetting', true);
      }
      break;

    case 'MicrosoftEdge':
      {
        // HACK: include Microsoft Driver path by nuget
        // const driverPath = path.join(
        //   __dirname,
        //   '../Selenium.WebDriver.MicrosoftDriver.17.17134.0/driver/',
        // );
        // process.env.PATH = `${process.env.PATH};${driverPath};`;
        capabilities = Capabilities.edge();
        capabilities.set('ignoreProtectedModeSettings', true);
        capabilities.set('ignoreZoomSetting', true);
      }
      break;

    case 'safari': {
      capabilities = Capabilities.safari();
      break;
    }
    case 'firefox': {
      // @ts-ignore
      require('geckodriver');
      capabilities = Capabilities.firefox();
      break;
    }
    case 'chrome': {
      require('chromedriver');
      capabilities = Capabilities.chrome();
      capabilities.set('chromeOptions', {
        args: [
          '--headless',
          '--no-sandbox',
          '--disable-gpu',
          '--window-size=630,4000',
        ],
      });
      break;
    }
  }

  let driver = await new Builder().withCapabilities(capabilities).build();
  const server = await launchServer();
  try {
    await driver.get(`http://127.0.0.1:${PORT}`);

    // wait for last choice to init
    await driver.wait(
      until.elementLocated(By.css('#reset-multiple ~ .choices__list')),
    );

    // Resize window
    await driver
      .manage()
      .window()
      // magic numbers here to make sure all demo page are fit inside
      .setRect({ width: 630, height: 4000 });

    // and click on press space on it, so it should open choices
    await driver
      .findElement(By.css('#reset-multiple ~ .choices__list button'))
      .sendKeys(Key.SPACE);
    await driver.sleep(500);

    // take screenshot
    const image = await driver.takeScreenshot();
    const imageBuffer = Buffer.from(image, 'base64');

    const artifactsPath = 'screenshot';
    mkdirSync(artifactsPath, { recursive: true });
    writeFileSync(path.join(artifactsPath, 'screenshot.png'), imageBuffer);

    // compare with snapshot
    const screenshot = PNG.sync.read(imageBuffer);
    const snapshot = PNG.sync.read(
      readFileSync(
        path.resolve(
          __dirname,
          `./__screenshots__/${process.env.BROWSER}-${process.platform}.png`,
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
        threshold: 0.1,
      },
    );
    writeFileSync(path.join(artifactsPath, 'diff.png'), PNG.sync.write(diff));

    // getting console logs
    // const entries = await driver
    //   .manage()
    //   .logs()
    //   .get(logging.Type.BROWSER);
    // entries.forEach(entry => {
    //   console.log('[%s] %s', entry.level.name, entry.message);
    // });
  } catch (err) {
    console.error(err);
    error = err;
  } finally {
    await driver.quit();
    await new Promise(resolve => server.close(resolve));
  }
  if (pixelDifference > 100) {
    console.error(
      `Snapshot is different from screenshot by ${pixelDifference} pixels`,
    );
    process.exit(1);
  }
  if (error) process.exit(1);
}

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});
process.once('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});
setImmediate(test);
