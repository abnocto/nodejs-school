'use strict';

const bankUtils = {
	/**
	 * Типы банковскиx карт
	 * @type {Object}
	 */
	cardTypes: {
		VISA: 'visa',
		MAESTRO: 'maestro',
		MASTERCARD: 'mastercard',
		MIR: 'mir'
	},

	/**
	 * Проверяет тип карты
	 * @param {Number} val номер карты
	 * @returns {String} тип карты
	 */
	getCardType(val) {
		// Бины ПС МИР 220000 - 220499
		const mirBin = /^220[0-4]\s?\d\d/;

		const firstNum = val[0];

		switch (firstNum) {
			case '2': {
				if (mirBin.test(val)) {
					return bankUtils.cardTypes.MIR;
				} else {
					return '';
				}
			}
			case '4': {
				return bankUtils.cardTypes.VISA;
			}
			case '5': {
				const secondNum = val[1] || '';

				if (secondNum === '0' || secondNum > '5') {
					return bankUtils.cardTypes.MAESTRO;
				} else {
					return bankUtils.cardTypes.MASTERCARD;
				}
			}
			case '6': {
				return bankUtils.cardTypes.MAESTRO;
			}
			default: {
				return '';
			}
		}
	},

	/**
	 * Форматирует номер карты, используя заданный разделитель
	 * @param {String} cardNumber номер карты
	 * @param {String} delimeter = '\u00A0' разделитель
	 * @returns {String} форматированный номер карты
	 */
	formatCardNumber(cardNumber, delimeter) {
		let formattedCardNumber = [];
		delimeter = delimeter || '\u00A0';
		if (cardNumber) {
			while (cardNumber && typeof cardNumber === 'string') {
				formattedCardNumber.push(cardNumber.substr(0, 4));
				cardNumber = cardNumber.substr(4);
				if (cardNumber) {
					formattedCardNumber.push(delimeter);
				}
			}
		}
		return formattedCardNumber.join('');
	},

	/**
	 * Validates card data from client
	 * @param {String} cardNumber
	 * @param {Number} balance
	 * @returns {Boolean} validation flag
	 */
	isDataValid(cardNumber, balance) {
		return typeof cardNumber === 'string'
			&& cardNumber.length === 16
			&& Number.isInteger(balance);
	},

	/**
	 * Check is card number valid with Luhn algorithm
	 * @param {String} cardNumber card number
	 * @returns {Boolean} validation flag
	 */
	isLuhnValid(cardNumber) {
		const sum = cardNumber.split('').reduce((s, elem, index) => {
			let val = Number(elem);
			if (index % 2 === 0) val *= 2;
			if (val > 9) val -= 9;
			return s + val;
		}, 0);
		return sum % 10 === 0;
	},
};

module.exports = bankUtils;
