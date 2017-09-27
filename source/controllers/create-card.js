'use strict';

const Cards = require('../models/cards');

function createCard(req, res) {
	const cards = new Cards();
	const card = req.body;
	cards.create(card)
		.then(card => res.json(card))
		.catch(err => res.status(err.status || 500).send(err.message));
}

module.exports = createCard;
