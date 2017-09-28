'use strict';

const AppError = require('../../libs/appError');
const FileModel = require('./common/fileModel');

class CardsModel extends FileModel {

	constructor() {
		super('cards.json');
	}

	/**
	 * Creates new card by data
	 * @param {Object} data Data to create card with
	 * @returns {Promise.<Object>}
	 */
	async create(data) {
		const card = {
			...data,
			id : Math.max(...Object.values(this._dataSource).map(_card => _card.id)) + 1,
			balance : Number(data.balance)
		};

		if (!this._isDataValid(card)) {
			throw new AppError(400, 'Bad request: Card data is invalid');
		}

		if (!this._isLuhnValid(card)) {
			throw new AppError(400, 'Bad request: Card number is invalid');
		}

		const cardIndex = this._dataSource.findIndex(_card => _card.cardNumber === card.cardNumber);
		if (cardIndex !== -1) {
			throw new AppError(400, 'Bad request: Duplicate card number');
		}

		this._dataSource.push(card);
		await this._writeFile();
		return card;
	}

	/**
	 * Validates card data
	 * @param {Object} card
	 * @returns {Boolean} validation flag
	 */
	_isDataValid(card) {
		if (!card) return false;
		const { cardNumber, balance } = card;
		return typeof cardNumber === 'string' && cardNumber.length === 16
			&& Number.isInteger(balance);
	}

	/**
	 * Validates card number with Luhn algorithm
	 * @param {Object} card
	 * @returns {Boolean} validation flag
	 */
	_isLuhnValid(card) {
		const sum = card.cardNumber.split('').reduce((s, elem, index) => {
			let val = Number(elem);
			if (index % 2 === 0) val *= 2;
			if (val > 9) val -= 9;
			return s + val;
		}, 0);
		return sum % 10 === 0;
	}

}

module.exports = CardsModel;
