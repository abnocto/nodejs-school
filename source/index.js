const http = require('http');
const https = require('https');
const fs = require('fs');
const config = require('./config');
const logger = require('../libs/logger')('SERVER');
const app = require('./app');
const db = require('./data');

const HTTP_PORT = config.HTTP.port;
const HTTPS_PORT = config.HTTPS.port;

const SSL_OPTIONS = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};

db.connect().then(() => {
  
  http.createServer((req, res) => {
    logger.info(`Redirect from http://localhost:${HTTP_PORT} to https://localhost:${HTTPS_PORT}`);
    res.writeHead(301, { Location: `https://localhost:${HTTPS_PORT}` });
    res.end();
  }).listen(HTTP_PORT, () => {
    logger.info(`YM Node School App listening on port ${HTTP_PORT} (HTTP)`);
  });
  
  https.createServer(SSL_OPTIONS, app.callback()).listen(HTTPS_PORT, () => {
    logger.info(`YM Node School App listening on port ${HTTPS_PORT} (HTTPS)`);
  });
  
});

// on process termination
process.on('SIGINT', async () => {
  await db.disconnect();
  process.exit(0);
});
