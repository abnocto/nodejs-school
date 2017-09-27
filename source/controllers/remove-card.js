'use strict';

const Cards = require('../models/cards');

async function removeCard(req, res, next) {
	try {
		const cardsModel = new Cards();
		const id = Number(req.params.id);
		await cardsModel.remove(id);
		res.sendStatus(200);
	} catch(err) {
		res.status(err.status || 500).send(err.message);
	} finally {
		next();
	}
}

module.exports = removeCard;
