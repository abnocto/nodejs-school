const AppError = require('../../libs/appError');
const FileModel = require('./common/fileModel');

class TransactionsModel extends FileModel {
  constructor() {
    super('transactions.json');
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
