module.exports = async (ctx) => {
  const id = ctx.params.id;
  await ctx.CardsService.remove(id);
  ctx.status = 200;
};
