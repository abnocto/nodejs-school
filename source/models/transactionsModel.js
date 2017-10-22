const MongooseModel = require('./common/mongooseModel');
const Transaction = require('../data/domain/transaction');
const AppError = require('../../libs/appError');

const toClient = (transaction) => {
  if (!transaction) return null;
  return {
    id: transaction.id,
    cardId: transaction.cardId.toString(),
    type: transaction.type,
    data: transaction.data,
    time: transaction.time,
    sum: transaction.sum,
  };
};

class TransactionsModel extends MongooseModel {
  constructor() {
    super(Transaction, toClient);
  }
  
  /**
   * Transaction updating is forbidden
   * @param {Object} object Transaction
   */
  async update(object) {
    throw new AppError(403, 'Forbidden: Transaction updating is forbidden');
  }
  
  /**
   * Transaction removing is forbidden
   * @param {Number} id Transaction id
   */
  async remove(id) {
    throw new AppError(403, 'Forbidden: Transaction removing is forbidden');
  }
}

module.exports = TransactionsModel;
