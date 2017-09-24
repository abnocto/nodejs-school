'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fsUtils = require('./libs/fsUtils');
const bankUtils = require('./libs/bankUtils');

const CARDS_FILE_PATH = './source/cards.json';

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send(`
		<!doctype html>
		<html>
			<head>
				<link rel="stylesheet" href="/style.css">
			</head>
			<body>
				<h1>Add card:</h1>
				<form action='/cards' method='post'>
					<input name='cardNumber' type='text' placeholder='Номер карты'/>
					<input name='balance'    type='text' placeholder='Баланс'/>
					<input type='submit' value='OK'>
				</form>
			</body>
		</html>
	`);
});

app.get('/cards', (req, res, next) => {
  fsUtils.readFile(CARDS_FILE_PATH)
		.then(JSON.parse)
		.then(res.json.bind(res))
		.catch(next);
});

app.post('/cards', (req, res, next) => {
	let { cardNumber, balance } = req.body;
	balance = Number(balance);
	if (!bankUtils.isDataValid(cardNumber, balance)) {
		const err = new Error('Bad request: Card data is invalid');
		err.status = 400;
		throw err;
	}

	if (!bankUtils.isLuhnValid(cardNumber)) {
		const err = new Error('Bad request: Card number is invalid');
		err.status = 400;
		throw err;
	}

	fsUtils.readFile(CARDS_FILE_PATH)
		.then(JSON.parse)
		.then((cards) => {
			const cardIndex = cards.findIndex(card => card.cardNumber === cardNumber);
			if (cardIndex !== -1) {
				const err = new Error('Bad request: Duplicate card number');
				err.status = 400;
				throw err;
			} else {
				cards.push({ cardNumber, balance });
				return cards;
			}
		})
		.then(JSON.stringify)
		.then((data) => fsUtils.writeFile(CARDS_FILE_PATH, data))
		.then((ok) => { res.json({cardNumber, balance }) })
		.catch(next);
});

app.delete('/cards/:id', (req, res, next) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		const err = new Error('Bad request: Id must be an integer');
		err.status = 400;
		throw err;
	}

	fsUtils.readFile(CARDS_FILE_PATH)
		.then(JSON.parse)
		.then((cards) => {
			if (cards.length <= id)	{
				const err = new Error('Not found: Card wasn\'t found by id');
				err.status = 404;
				throw err;
			} else {
				cards.splice(id, 1);
				return cards;
			}
		})
		.then(JSON.stringify)
		.then((data) => fsUtils.writeFile(CARDS_FILE_PATH, data))
		.then(res.sendStatus.bind(res, 200))
		.catch(next);
});

app.get('/error', (req, res) => {
	throw new Error('Oops!');
});

app.get('/transfer', (req, res) => {
	const { amount, from, to } = req.query;
	res.json({
		result: 'success',
		amount,
		from,
		to
	});
});

app.use((err, req, res, next) => {
	if (!err.status) {
		next(err);
	} else {
		res.status(err.status).send(err.message);
	}
});

app.use((err, req, res, next) => {
	res.status(500).send(err.message);
});

app.listen(3000, () => {
	console.log('YM Node School App listening on port 3000!');
});
