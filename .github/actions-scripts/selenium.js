const path = require('path');
const { once } = require('events');
const { writeFile } = require('fs').promises;

const express = require('express');
const {
  Builder,
  By,
  Key,
  until,
  WebDriver,
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
  let driver = await new Builder()
    .forBrowser('safari')
    .setLoggingPrefs({ browser: 'ALL' })
    .build();
  const server = await launchServer();
  try {
    await driver.get(`http://127.0.0.1:${PORT}`);
    // driver.
    // await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);

    // set the window inner size to 800 x 600

    // quit
    await driver.wait(By.)
    await driver.sleep(1000);
    await driver
      .manage()
      .window()
      .setRect({ width: 630, height: 3900 });

    // take screenshot
    const image = await driver.takeScreenshot();
    await writeFile('screenshot.png', image, 'base64');

    // getting console logs
    const entries = await driver
      .manage()
      .logs()
      .get(logging.Type.BROWSER);
    entries.forEach(entry => {
      console.log('[%s] %s', entry.level.name, entry.message);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await driver.quit();
    await new Promise(resolve => server.close(resolve));
  }
}

setImmediate(test);
