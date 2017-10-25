const { renderToStaticNodeStream } = require('react-dom/server');
const indexView = require('../views');
const { readCards } = require('../client/reducers/card');
const { readTransactions } = require('../client/reducers/transaction');

module.exports = async (ctx) => {
  const cards = await ctx.cardsService.getAll();
  const transactions = await ctx.transactionsService.getAll();
  
  const data = {
    user: {
      login: 'samuel_johnson',
      name: 'Samuel Johnson',
      phoneNumber: '+79218908064',
      email: 'samueljohnson@yandex.ru',
    },
    card: readCards({}, cards),
    transaction: readTransactions({}, transactions),
  };
  
  ctx.status = 200;
  ctx.set('Content-Type', 'text/html');
  ctx.body = renderToStaticNodeStream(indexView(data));
};
