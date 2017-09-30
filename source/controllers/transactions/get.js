module.exports = async (ctx) => {
  const cardId = Number(ctx.params.id);
  ctx.body = await ctx.TransactionsModel.getBy('cardId', cardId);
  ctx.status = 200;
};
