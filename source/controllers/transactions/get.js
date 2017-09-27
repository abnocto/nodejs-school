'use strict';

module.exports = async (ctx) => {
	const cardId = Number(ctx.params.id);
	ctx.body = await ctx.TransactionsModel.getByCardId(cardId);
	ctx.status = 200;
};
