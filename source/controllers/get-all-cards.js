'use strict';

const Cards = require('../models/cards');

async function getAllCards(req, res, next) {
	try {
		const cardsModel = new Cards();
		const cards = await cardsModel.getAll();
		res.json(cards);
	} catch(err) {
		res.status(err.status || 500).send(err.message);
	} finally {
		next();
	}
}

module.exports = getAllCards;
