'use strict';

module.exports = async (ctx, next) => {
	const id = Number(ctx.params.id);
	await ctx.CardsModel.remove(id);
	ctx.status = 200;
};
