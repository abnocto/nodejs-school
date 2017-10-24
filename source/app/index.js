const Koa = require('koa');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');

const router = require('../routes');

const CardsService = require('../services/cardsService');
const TransactionsService = require('../services/transactionsService');

const CardsModel = require('../models/cardsModel');
const TransactionsModel = require('../models/transactionsModel');

const AppError = require('../../libs/appError');

const logger = require('../../libs/logger')('APP');

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
  const cardsModel = new CardsModel();
  const transactionsModel = new TransactionsModel();
  ctx.cardsService = new CardsService({ cardsModel, transactionsModel });
  ctx.transactionsService = new TransactionsService({ cardsModel, transactionsModel });
  await next();
});

// bodyParser
app.use(bodyParser());

// router
app.use(router.routes());

// serve static
app.use(serve('./public'));

module.exports = app;
