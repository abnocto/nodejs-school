module.exports = async (ctx) => {
  const data = ctx.request.body;
  ctx.body = await ctx.cardsService.create(data);
  ctx.status = 201;
};
