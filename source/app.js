'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const getAllCardsController = require('./controllers/get-all-cards');
const createCardController = require('./controllers/create-card');
const removeCardController = require('./controllers/remove-card');
const errorController = require('./controllers/error');

const app = express();

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/cards', getAllCardsController);
app.post('/cards', createCardController);
app.delete('/cards/:id', removeCardController);

app.all('/error', errorController);

app.use((err, req, res, next) => {
	console.log(err);
	res.sendStatus(500);
});

app.listen(3000, () => {
	console.log('YM Node School App listening on port 3000!');
});

module.exports = app;
