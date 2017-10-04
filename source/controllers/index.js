const ssr = require('../../public/bundle.server').default;

module.exports = (ctx) => {
  ctx.body = ssr();
};
