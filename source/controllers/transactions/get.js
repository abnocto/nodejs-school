module.exports = async (ctx) => {
  const cardId = ctx.params.id;
  ctx.body = await ctx.TransactionsService.getBy('cardId', cardId);
  ctx.status = 200;
};
