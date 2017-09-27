'use strict';

const Cards = require('../models/cards');

function getCard(req, res) {
	const cards = new Cards();
	const id = Number(req.params.id);
	cards.get(id)
		.then(card => res.json(card))
		.catch(err => res.status(err.status || 500).send(err.message));
}

module.exports = getCard;
