module.exports = async (ctx) => {
  const id = Number(ctx.params.id);
  const data = ctx.request.body;
  ctx.body = await ctx.cardsService.transfer(id, data);
  ctx.status = 200;
};
