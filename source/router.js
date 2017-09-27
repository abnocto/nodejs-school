'use strict';

const router = require('koa-router')();

const getAllCardsController = require('./controllers/cards/get-all');
const createCardController = require('./controllers/cards/create');
const removeCardController = require('./controllers/cards/remove');

const errorController = require('./controllers/error');

router.get('/cards', getAllCardsController);
router.post('/cards', createCardController);
router.delete('/cards/:id', removeCardController);

router.all('/error', errorController);

module.exports = router;
