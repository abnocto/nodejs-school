'use strict';

module.exports = async (ctx) => {
	const data = ctx.request.body;
	ctx.body = await ctx.TransactionsModel.create(data);
	ctx.status = 201;
};
