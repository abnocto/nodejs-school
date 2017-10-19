const http = require('http');
const https = require('https');
const fs = require('fs');
const Koa = require('koa');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');

const router = require('./router');

const CardsService = require('./services/cardsService');
const TransactionsService = require('./services/transactionsService');

const AppError = require('../libs/appError');

const logger = require('../libs/logger')('wallet-app');

const app = new Koa();

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const time = Date.now() - start;
  logger.info(`Request log: ${ctx.method} ${ctx.path} ${ctx.status} ${ctx.state.isError ? `'Error: ${ctx.body}'` : ''} ${time} ms`);
});

// error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof AppError) {
      ctx.status = err.status;
    } else {
      ctx.status = 500;
      logger.error(`Server error: ${err.message} ${err.stack}`);
    }
    ctx.body = err.message;
    ctx.state.isError = true;
  }
});

// add services as context props
app.use(async (ctx, next) => {
  ctx.CardsService = new CardsService();
  ctx.TransactionsService = new TransactionsService();
  await next();
});

// bodyParser
app.use(bodyParser());

// router
app.use(router.routes());

// serve static
app.use(serve('./public'));

const HTTP_PORT = 3000;
const HTTPS_PORT = 8000;

const SSL_OPTIONS = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};

const HTTP_SERVER = http.createServer((req, res) => {
  logger.info(`Redirect from http://localhost:${HTTP_PORT} to https://localhost:${HTTPS_PORT}`);
  res.writeHead(301, { Location: `https://localhost:${HTTPS_PORT}` });
  res.end();
}).listen(HTTP_PORT, () => {
  logger.info(`YM Node School App listening on port ${HTTP_PORT} (HTTP)!`);
});

const HTTPS_SERVER = https.createServer(SSL_OPTIONS, app.callback()).listen(HTTPS_PORT, () => {
  logger.info(`YM Node School App listening on port ${HTTPS_PORT} (HTTPS)!`);
});

module.exports = {
  HTTP_SERVER,
  HTTPS_SERVER,
};
