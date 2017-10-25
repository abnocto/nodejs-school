const get = async (ctx) => {
  const cardId = Number(ctx.params.id);
  ctx.body = await ctx.transactionsService.getBy('cardId', cardId);
  ctx.status = 200;
};

const create = async (ctx) => {
  const data = ctx.request.body;
  const cardId = Number(ctx.params.id);
  ctx.body = await ctx.transactionsService.create(data, cardId);
  ctx.status = 201;
};

const history = async (ctx) => {
  const cardId = Number(ctx.params.id);
  ctx.body = await ctx.transactionsService.getHistoryStream(cardId);
  ctx.status = 200;
};

module.exports = {
  get,
  create,
  history,
};
