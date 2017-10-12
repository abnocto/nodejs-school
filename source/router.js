const router = require('koa-router')();

const indexController = require('./controllers/index');

const getAllCardsController = require('./controllers/cards/get-all');
const createCardController = require('./controllers/cards/create');
const removeCardController = require('./controllers/cards/remove');

const payCardController = require('./controllers/cards/pay');
const fillCardController = require('./controllers/cards/fill');

const getTransactionsController = require('./controllers/transactions/get');
const createTransactionController = require('./controllers/transactions/create');

const errorController = require('./controllers/error');

router.get('/', indexController);

router.get('/cards', getAllCardsController);
router.post('/cards', createCardController);
router.delete('/cards/:id', removeCardController);

router.post('/cards/:id/pay', payCardController);
router.post('/cards/:id/fill', fillCardController);

router.get('/cards/:id/transactions', getTransactionsController);
router.post('/cards/:id/transactions', createTransactionController);

router.all('/error', errorController);

module.exports = router;
