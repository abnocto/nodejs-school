const { renderToStaticMarkup } = require('react-dom/server');
const indexView = require('../views');
const { readCards } = require('../client/reducers/card');
const { readTransactions } = require('../client/reducers/transaction');

module.exports = async (ctx) => {
  const cards = await ctx.CardsService.getAll();
  const transactions = await ctx.TransactionsService.getAll();
  
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
  
  ctx.body = renderToStaticMarkup(indexView(data));
};
