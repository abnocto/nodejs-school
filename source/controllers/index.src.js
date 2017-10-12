const { renderToStaticMarkup } = require('react-dom/server');
const indexView = require('../views');
const { read } = require('../client/service/objectService');

module.exports = async (ctx) => {
  const cards = await ctx.CardsService.getAll();
  
  let transactions = [];
  if (cards[0]) transactions = await ctx.TransactionsService.getBy('cardId', cards[0].id);
  
  const data = {
    user: {
      login: 'samuel_johnson',
      name: 'Samuel Johnson',
    },
    card: read({}, cards),
    transaction: read({}, transactions),
  };
  
  ctx.body = renderToStaticMarkup(indexView(data));
};
