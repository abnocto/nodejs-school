module.exports = async (ctx) => {
  const id = Number(ctx.params.id);
  const data = ctx.request.body;
  await ctx.CardsService.mobile(id, data, 'REFILL');
  ctx.status = 200;
};
