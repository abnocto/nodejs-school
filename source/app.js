'use strict';

const Koa = require('koa');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');

const router = require('./router');

const CardsModel = require('./models/cardsModel');

const AppError = require('../libs/appError');

const app = new Koa();

//logger
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const time = Date.now() - start;
	console.log(`Request log: ${ctx.method} ${ctx.path} ${ctx.status} ${ctx.state.isError ? `'Error: ${ctx.body}'` : ''} ${time} ms`);
});

//error handler
app.use(async (ctx, next) => {
	try {
		await next();
	} catch(err) {
		if (err instanceof AppError) {
			ctx.status = err.status;
		} else {
			ctx.status = 500;
			console.log(`Server error: ${err.message}`);
		}
		ctx.body = err.message;
		ctx.state.isError = true;
	}
});

//add model as context prop
app.use(async (ctx, next) => {
	ctx.CardsModel = new CardsModel();
	await ctx.CardsModel.readFile();
	await next();
});

//bodyParser
app.use(bodyParser());

//router
app.use(router.routes());

//serve static
app.use(serve('./public'));

module.exports = app.listen(3000, () => {
	console.log('YM Node School App listening on port 3000!');
});
