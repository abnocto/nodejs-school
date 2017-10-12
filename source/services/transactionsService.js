const AppError = require('../../libs/appError');
const utils = require('../../libs/utils');

const Service = require('./common/service');

const CardsModel = require('../models/cardsModel');
const TransactionsModel = require('../models/transactionsModel');

class TransactionsService extends Service {
  constructor() {
    super(new TransactionsModel());
    this._cardsModel = new CardsModel();
  }
  
  /**
   * Creates new transaction by data
   * @param {Object} data Data to create transaction with
   * @param {Number} cardId card id (foreign key)
   * @returns {Promise.<Object>}
   */
  async create(data, cardId) {
    const allowedKeys = ['cardId', 'type', 'data', 'time', 'sum'];
    const allowedData = utils.pick(data, allowedKeys);
  
    const requiredKeys = ['type', 'data', 'sum'];
    if (requiredKeys.some(key => !Object.prototype.hasOwnProperty.call(allowedData, key))) {
      throw new AppError(400, 'Bad request: Transaction data doesn\'t have all required fields');
    }
  
    const allowedTypes = ['prepaidCard', 'paymentMobile', 'card2Card'];
    if (typeof allowedData.type !== 'string' || !allowedTypes.includes(allowedData.type)) {
      throw new AppError(403, 'Forbidden: Forbidden transaction type');
    }
    
    if (typeof allowedData.sum !== 'number') {
      throw new AppError(400, 'Bad request: Transaction sum is invalid');
    }
    
    const card = await this._getCardsModel().get(cardId);
    if (!card) {
      throw new AppError(404, 'Not found: Card wasn\'t found by transaction card id');
    }
    allowedData.cardId = cardId;
  
    if (allowedData.time && !Date.parse(allowedData.time)) {
      throw new AppError(400, 'Bad request: Invalid transaction time');
    }
  
    if (!allowedData.time) {
      allowedData.time = (new Date()).toISOString();
    }
    
    return await this._getModel().create(allowedData);
  }
  
  /**
   * Returns CardsModel instance
   * @returns {Object}
   * @private
   */
  _getCardsModel() {
    return this._cardsModel;
  }
}

module.exports = TransactionsService;
