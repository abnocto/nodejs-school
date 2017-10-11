const { renderToStaticMarkup } = require('react-dom/server');
const indexView = require('../views');

module.exports = (ctx) => {
  const data = {
    user: {
      login: 'samuel_johnson',
      name: 'Samuel Johnson',
    },
  };
  ctx.body = renderToStaticMarkup(indexView(data));
};
