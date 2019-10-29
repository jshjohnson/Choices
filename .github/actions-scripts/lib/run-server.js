const path = require('path');
const http = require('http');
const { createReadStream } = require('fs');
const { pipeline, once } = require('stream');

async function launchServer() {
  const serverRoot = path.resolve(__dirname, '../../../public/');
  const EXT_TO_MIME = new Map([
    ['.js', 'application/javascript'],
    ['.css', 'text/css'],
    ['.svg', 'image/svg+xml'],
    ['.html', 'text/html'],
  ]);
  const server = http.createServer((req, res) => {
    const url = req.url === '/' ? 'index.html' : req.url;
    const fullPath = path.join(serverRoot, url);
    res.setHeader(
      'content-type',
      EXT_TO_MIME.get(path.extname(url)) || 'binary',
    );
    pipeline(createReadStream(fullPath), res, err => {
      if (err) throw err;
    });
  });
  server.listen(0, err => {
    if (err) throw err;
    console.log(`⚙️  Listening at http://localhost:${server.address().port}...`);
  });
  await once(server, 'listening');
  return server;
}
module.exports = launchServer;
