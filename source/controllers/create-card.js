'use strict';

const Cards = require('../models/cards');

async function createCard(req, res, next) {
	try {
		const cardsModel = new Cards();
		const reqCard = req.body;
		const resCard = await cardsModel.create(reqCard);
		res.json(resCard);
	} catch(err) {
		res.status(err.status || 500).send(err.message);
	} finally {
		next();
	}
}

module.exports = createCard;
