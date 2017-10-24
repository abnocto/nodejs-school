const get = async (ctx) => {
  ctx.body = await ctx.cardsService.getAll();
  ctx.status = 200;
};

const create = async (ctx) => {
  const data = ctx.request.body;
  ctx.body = await ctx.cardsService.create(data);
  ctx.status = 201;
};

const remove = async (ctx) => {
  const id = Number(ctx.params.id);
  await ctx.cardsService.remove(id);
  ctx.status = 200;
};

const pay = async (ctx) => {
  const id = Number(ctx.params.id);
  const data = ctx.request.body;
  ctx.body = await ctx.cardsService.mobile(id, data, 'PAYMENT');
  ctx.status = 200;
};

const refill = async (ctx) => {
  const id = Number(ctx.params.id);
  const data = ctx.request.body;
  ctx.body = await ctx.cardsService.mobile(id, data, 'REFILL');
  ctx.status = 200;
};

const transfer = async (ctx) => {
  const id = Number(ctx.params.id);
  const data = ctx.request.body;
  ctx.body = await ctx.cardsService.transfer(id, data);
  ctx.status = 200;
};

module.exports = {
  get,
  create,
  remove,
  pay,
  refill,
  transfer,
};
