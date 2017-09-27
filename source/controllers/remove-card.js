'use strict';

const Cards = require('../models/cards');

function removeCard(req, res) {
	const cards = new Cards();
	const id = Number(req.params.id);
	cards.remove(id)
		.then(() => res.sendStatus(200))
		.catch(err => res.status(err.status || 500).send(err.message));
}

module.exports = removeCard;
