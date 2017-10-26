const MongooseModel = require('./common/mongooseModel');
const Transaction = require('./db/transaction');
const transactionClientTransformer = require('./transform/transactionClientTransform');
const transactionSecureTransformer = require('./transform/transactionSecureTransform');
const transactionHistoryTransformer = require('./transform/transactionHistoryTransform');
const transactionCSVTransformer = require('./transform/transactionCSVTransform');
const AppError = require('../../libs/appError');

class TransactionsModel extends MongooseModel {
  constructor() {
    super(Transaction, [transactionClientTransformer, transactionSecureTransformer]);
  }
  
  /**
   * Transaction updating is forbidden
   * @param {Number} id Object id
   * @param {Object} object Object to update
   * @param {Boolean} isSet Sets props from `object` to object or replace full object with `object`
   */
  async update(id, object, isSet) {
    throw new AppError(403, 'Forbidden: Transaction updating is forbidden');
  }

  /**
   * Transaction removing is forbidden
   * @param {Number} id Transaction id
   */
  async remove(id) {
    throw new AppError(403, 'Forbidden: Transaction removing is forbidden');
  }
  
  /**
   * Returns today transaction history csv stream
   * @param cardId Card id
   * @returns {Stream}
   */
  getHistoryStream(cardId) {
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dbCursor = Transaction.find({ cardId, time: { $gte: dayStart.toISOString() } }).cursor();
    const historyTransformers = [transactionHistoryTransformer, transactionSecureTransformer, transactionCSVTransformer];
    return historyTransformers.reduce((stream, transformer) => stream.pipe(transformer()), dbCursor);
  }
}

module.exports = TransactionsModel;
