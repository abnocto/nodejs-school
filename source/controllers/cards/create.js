module.exports = async (ctx) => {
  const data = ctx.request.body;
  ctx.body = await ctx.CardsService.create(data);
  ctx.status = 201;
};
