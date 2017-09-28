'use strict';

const AppError = require('../../libs/appError');
const FileModel = require('./common/fileModel');

class TransactionsModel extends FileModel {

	constructor() {
		super('transactions.json');
	}

	/**
	 * Creates new transaction by data
	 * @param {Object} data Data to create transaction with
	 * @returns {Promise.<Object>}
	 */
	async create(data) {
		const transaction = {
			...data,
			id : Math.max(...Object.values(this._dataSource).map(_transaction => _transaction.id)) + 1,
			cardId : Number(data.cardId),
			sum : Number(data.sum)
		};

		if (!this._isDataValid(transaction)) {
			throw new AppError(400, 'Bad request: Transaction data is invalid');
		}

		this._dataSource.push(transaction);
		await this._writeFile();
		return transaction;
	}

	/**
	 * Transaction removing is forbidden
	 * @param {Number} id Transaction id
	 */
	async remove(id) {
		throw new AppError(403, 'Forbidden: Transaction removing is forbidden');
	}

	/**
	 * Validates transaction data
	 * @param {Object} transaction
	 * @returns {Boolean} validation flag
	 */
	_isDataValid(transaction) {
		if (!transaction) return false;
		const { cardId, type, data, time, sum } = transaction;
		return Number.isInteger(cardId) && cardId >= 1
			&& typeof type === 'string' && TransactionsModel.ALLOWED_TYPES.includes(type)
			&& !!data
		  && !!time
			&& Number.isInteger(sum);
	}

}

module.exports = TransactionsModel;

TransactionsModel.ALLOWED_TYPES = ['prepaidCard', 'paymentMobile', 'card2Card'];
