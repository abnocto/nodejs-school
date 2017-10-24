module.exports = async (ctx) => {
  ctx.body = await ctx.cardsService.getAll();
  ctx.status = 200;
};
