'use strict';

const Cards = require('../models/cards');

function getAllCards(req, res) {
	const cards = new Cards();
	cards.getAll()
		.then(cards => res.json(cards))
		.catch(err => res.status(err.status || 500).send(err.message));
}

module.exports = getAllCards;
