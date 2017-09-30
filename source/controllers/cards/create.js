module.exports = async (ctx) => {
  const data = ctx.request.body;
  ctx.body = await ctx.CardsModel.create(data);
  ctx.status = 201;
};
