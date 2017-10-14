module.exports = async (ctx) => {
  const id = Number(ctx.params.id);
  const data = ctx.request.body;
  ctx.body = await ctx.CardsService.transfer(id, data);
  ctx.status = 200;
};
