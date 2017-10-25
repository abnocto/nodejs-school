const MongooseModel = require('./common/mongooseModel');
const Transaction = require('./db/transaction');
const transactionClientTransformer = require('./transform/transactionClientTransform');
const AppError = require('../../libs/appError');

class TransactionsModel extends MongooseModel {
  constructor() {
    super(Transaction, [transactionClientTransformer]);
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
}

module.exports = TransactionsModel;
