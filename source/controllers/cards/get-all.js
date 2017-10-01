module.exports = async (ctx) => {
  ctx.body = await ctx.CardsService.getAll();
  ctx.status = 200;
};
