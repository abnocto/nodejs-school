'use strict';

const Cards = require('../models/cards');

async function getCard(req, res, next) {
	try {
		const cardsModel = new Cards();
		const id = Number(req.params.id);
		const card = await cardsModel.get(id);
		res.json(card);
	} catch(err) {
		res.status(err.status || 500).send(err.message);
	} finally {
		next();
	}
}

module.exports = getCard;
