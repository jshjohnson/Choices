const path = require('path');
const express = require('express');

async function launchServer() {
  const app = express();
  app.use(express.static(path.join(__dirname, '../../../public')));

  return new Promise((resolve, reject) => {
  const server = app.listen(0, err => {
    if (err) reject(err);
    else {
      console.log(`Listening at http://localhost:${server.address().port}`);
      resolve(server);
    }
  });
})
}
module.exports = launchServer;
