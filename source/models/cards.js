'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const AppError = require('../../libs/AppError');
const bankUtils = require('../../libs/bankUtils');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class Cards {

	getAll() {
		return new Promise((resolve, reject) => {
			readFile(Cards.FILE_PATH)
				.then(JSON.parse)
				.then(resolve)
				.catch(reject);
		});
	}

	get(id) {
		return new Promise((resolve, reject) => {
			if (!Number.isInteger(id) || id <= 0) {
				reject(new AppError(400, 'Bad request: Id must be a positive integer'));
				return;
			}

			readFile(Cards.FILE_PATH)
				.then(JSON.parse)
				.then((cards) => {
					const card = cards.find(card => card.id === id);
					if (card) return card;
					else throw new AppError(404, `Not found: Card wasn't found by id ${id}`);
				})
				.then(resolve)
				.catch(reject);
		});
	}

	create(card) {
		return new Promise((resolve, reject) => {
			card.balance = Number(card.balance);
			const { cardNumber, balance } = card;
			if (!bankUtils.isDataValid(cardNumber, balance)) {
				reject(new AppError(400, 'Bad request: Card data is invalid'));
				return;
			}

			if (!bankUtils.isLuhnValid(cardNumber)) {
				reject(new AppError(400, 'Bad request: Card number is invalid'));
				return;
			}

			readFile(Cards.FILE_PATH)
				.then(JSON.parse)
				.then((cards) => {
					const cardIndex = cards.findIndex(card => card.cardNumber === cardNumber);
					if (cardIndex !== -1) {
						throw new AppError(400, 'Bad request: Duplicate card number');
					} else {
						card.id = cards.length + 1;
						cards.push(card);
						return cards;
					}
				})
				.then(JSON.stringify)
				.then(cardsJson => writeFile(Cards.FILE_PATH, cardsJson))
				.then(() => {
					resolve(card);
				})
				.catch(reject);
		});
	}

	remove(id) {
		return new Promise((resolve, reject) => {
			if (!Number.isInteger(id) || id <= 0) {
				reject(new AppError(400, 'Bad request: Id must be a positive integer'));
				return;
			}

			readFile(Cards.FILE_PATH)
				.then(JSON.parse)
				.then((cards) => {
					const cardIndex = cards.findIndex(card => card.id === id);
					if ( cardIndex === -1 ) {
						throw new AppError(404, `Not found: Card wasn't found by id ${id}`);
					} else {
						cards.splice(cardIndex, 1);
						return cards;
					}
				})
				.then(JSON.stringify)
				.then(cardsJson => writeFile(Cards.FILE_PATH, cardsJson))
				.then(() => {
					resolve();
				})
				.catch(reject);
		});
	}

	removeAll() {
		return writeFile(Cards.FILE_PATH, '[]');
	}

}

Cards.FILE_PATH = path.join(__dirname, '..', 'cards.json');

module.exports = Cards;
