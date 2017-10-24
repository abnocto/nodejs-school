const MongooseModel = require('./common/mongooseModel');
const Transaction = require('./db/transaction');
const AppError = require('../../libs/appError');

const toClient = (obj) => {
  if (!obj) return null;
  return {
    id: obj.id,
    cardId: obj.cardId,
    type: obj.type,
    data: obj.data,
    time: obj.time,
    sum: obj.sum,
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
