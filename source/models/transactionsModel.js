const MongooseModel = require('./common/mongooseModel');
const Transaction = require('./db/transaction');
const transactionClientTransformer = require('./transform/transactionClientTransform');
const transactionSecureTransformer = require('./transform/transactionSecureTransform');
const transactionHistoryTransformer = require('./transform/transactionHistoryTransform');
const transactionCSVTransformer = require('./transform/transactionCSVTransform');
const AppError = require('../../libs/appError');
const { securify } = require('../../libs/bankUtils');

class TransactionsModel extends MongooseModel {
  constructor() {
    super(Transaction, [transactionClientTransformer, transactionSecureTransformer]);
  }
  
  /**
   * Creates new db transaction by data
   * @param {Object} data Data to create object with
   * @returns {Promise.<Object>}
   */
  async create(data) {
    const transaction = await super.create(data);
    const dbTransaction = await Transaction.findOne({ id: transaction.id });
    return Object.assign({}, transaction, { data: securify(dbTransaction.data) });
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
    const dayStartUTC = new Date(dayStart.getTime() + dayStart.getTimezoneOffset() * 60 * 1000);
    const year = dayStartUTC.getFullYear();
    const month = String(dayStartUTC.getMonth() + 1).padStart(2, '0');
    const day = String(dayStartUTC.getDate()).padStart(2, '0');
    const hours = String(dayStartUTC.getHours());
    const dbCursor = Transaction.find({ cardId, time: { $gte: `${year}-${month}-${day}T${hours}:00:00.000Z` } }).cursor();
    const historyTransformers = [transactionHistoryTransformer, transactionSecureTransformer, transactionCSVTransformer];
    return historyTransformers.reduce((stream, transformer) => stream.pipe(transformer()), dbCursor);
  }
}

module.exports = TransactionsModel;
