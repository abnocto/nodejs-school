module.exports = async (ctx) => {
  const id = Number(ctx.params.id);
  await ctx.cardsService.remove(id);
  ctx.status = 200;
};
