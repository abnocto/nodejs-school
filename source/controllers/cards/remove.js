module.exports = async (ctx) => {
  const id = Number(ctx.params.id);
  await ctx.CardsModel.remove(id);
  ctx.status = 200;
};
