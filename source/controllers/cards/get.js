module.exports = async (ctx) => {
  const id = Number(ctx.params.id);
  ctx.body = await ctx.CardsModel.get(id);
  ctx.status = 200;
};
