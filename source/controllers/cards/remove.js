module.exports = async (ctx) => {
  const id = Number(ctx.params.id);
  await ctx.CardsService.remove(id);
  ctx.status = 200;
};
