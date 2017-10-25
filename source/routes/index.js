const router = require('koa-router')();

const indexController = require('../controllers/index');
const cardsController = require('../controllers/card');
const transactionsController = require('../controllers/transaction');
const errorController = require('../controllers/error');

router.get('/', indexController);

router.get('/cards', cardsController.get);
router.post('/cards', cardsController.create);
router.delete('/cards/:id', cardsController.remove);

router.post('/cards/:id/pay', cardsController.pay);
router.post('/cards/:id/fill', cardsController.refill);
router.post('/cards/:id/transfer', cardsController.transfer);

router.get('/cards/:id/transactions', transactionsController.get);
router.post('/cards/:id/transactions', transactionsController.create);

router.get('/cards/:id/file-transactions', transactionsController.history);

router.all('/error', errorController);

module.exports = router;
