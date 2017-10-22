module.exports = async (ctx) => {
  const id = ctx.params.id;
  const data = ctx.request.body;
  ctx.body = await ctx.CardsService.mobile(id, data, 'REFILL');
  ctx.status = 200;
};
