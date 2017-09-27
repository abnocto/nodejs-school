'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const AppError = require('../../libs/AppError');
const bankUtils = require('../../libs/bankUtils');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class Cards {

	async getAll() {
		const cardsJSON = await readFile(Cards.FILE_PATH);
		return JSON.parse(cardsJSON);
	}

	async get(id) {
		if (!Number.isInteger(id) || id <= 0) {
			throw new AppError(400, 'Bad request: Id must be a positive integer');
		}

		const cardsJSON = await readFile(Cards.FILE_PATH);
		const cards = JSON.parse(cardsJSON);
		const card = cards.find(card => card.id === id);
		if (card) {
			return card;
		}

		throw new AppError(404, `Not found: Card wasn't found by id ${id}`);
	}

	async create(card) {
		const { cardNumber } = card;
		const balance = Number(card.balance);
		if (!bankUtils.isDataValid(cardNumber, balance)) {
			throw new AppError(400, 'Bad request: Card data is invalid');
		}

		if (!bankUtils.isLuhnValid(cardNumber)) {
			throw new AppError(400, 'Bad request: Card number is invalid');
		}

		const cardsJSON = await readFile(Cards.FILE_PATH);
		const cards = JSON.parse(cardsJSON);
		const cardIndex = cards.findIndex(card => card.cardNumber === cardNumber);
		if (cardIndex !== -1) {
			throw new AppError(400, 'Bad request: Duplicate card number');
		}

		const id = cards.length + 1;
		cards.push({ id, cardNumber, balance });
		await writeFile(Cards.FILE_PATH, JSON.stringify(cards));
		return { id, cardNumber, balance };
	}

	 async remove(id) {
		 if (!Number.isInteger(id) || id <= 0) {
			 throw new AppError(400, 'Bad request: Id must be a positive integer');
		 }

		 const cardsJSON = await readFile(Cards.FILE_PATH);
		 const cards = JSON.parse(cardsJSON);
		 const cardIndex = cards.findIndex(card => card.id === id);
		 if (cardIndex === -1) {
			 throw new AppError(404, `Not found: Card wasn't found by id ${id}`);
		 }

		 cards.splice(cardIndex, 1);
		 await writeFile(Cards.FILE_PATH, JSON.stringify(cards));
	}

	async removeAll() {
		await writeFile(Cards.FILE_PATH, '[]');
	}

}

Cards.FILE_PATH = path.join(__dirname, '..', 'cards.json');

module.exports = Cards;
