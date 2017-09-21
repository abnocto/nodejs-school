const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');

const cards = require('./source/cards');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send(`<!doctype html>
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
	</html>`);
});

app.get('/cards', (req, res) => {
  res.json(cards);
});

app.post('/cards', (req, res) => {
	const { cardNumber, balance } = req.body;
	const cardIndex = cards.findIndex( card => card.cardNumber === cardNumber );
	if ( cardIndex === -1 ) {
		if ( isValid( cardNumber ) ) {
			const card = { cardNumber, balance };
			cards.push( card );
			writeCards( cards );
			res.json(card);
		} else {
			res.statusCode = 400;
			res.end('Bad request: Card number is invalid!');
		}
	} else {
		res.statusCode = 400;
		res.end('Bad request: Card number repeat!');
	}
});

app.delete('/cards/:id', (req, res) => {
	const cardIndex = cards.findIndex( card => card.cardNumber === req.params.id );
	if ( cardIndex !== -1 ) {
		cards.splice( cardIndex, 1 );
		writeCards( cards );
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
	}
});

//to util: write to cards json
function writeCards( cards ) {
	const path = './source/cards.json';
	fs.exists(path, function(exists) {
    if (exists) {
      fs.writeFile(path, JSON.stringify(cards));
    }
  });
}

//to util: luna validation
function isValid( cardNumber ) {
	const length = cardNumber.length;
	let sum = 0;
	for ( let i = 0; i < length; i += 1 ) {
		let val;
		if ( i % 2 == 0 ) {
			val = 2 * Number( cardNumber[i] );
			val = val > 9 ? val - 9 : val;
		} else {
			val = Number( cardNumber[i] );
		}
		sum += val;
	}
	return sum % 10 === 0;
}

app.get('/error', (req, res) => {
	throw Error('Oops!');
});

app.get('/transfer', (req, res) => {
	const {amount, from, to} = req.query;
	res.json({
		result: 'success',
		amount,
		from,
		to
	});
});

app.listen(3000, () => {
	console.log('YM Node School App listening on port 3000!');
});
