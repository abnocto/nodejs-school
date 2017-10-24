module.exports = async (ctx) => {
  const data = ctx.request.body;
  const cardId = Number(ctx.params.id);
  ctx.body = await ctx.transactionsService.create(data, cardId);
  ctx.status = 201;
};
