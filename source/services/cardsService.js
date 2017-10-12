const AppError = require('../../libs/appError');

const Service = require('./common/service');

const CardsModel = require('../models/cardsModel');
const TransactionsModel = require('../models/transactionsModel');

class CardsService extends Service {
  constructor() {
    super(new CardsModel());
    this._transactionsModel = new TransactionsModel();
  }
  
  /**
   * Creates new card by data
   * @param {Object} data Data to create card with
   * @returns {Promise.<Object>}
   */
  async create(data) {
    if (!this._isDataValid(data)) {
      throw new AppError(400, 'Bad request: Card data is invalid');
    }
  
    if (!this._isLuhnValid(data)) {
      throw new AppError(400, 'Bad request: Card number is invalid');
    }
    
    const cardsList = await this._getModel().getBy('cardNumber', data.cardNumber);
    if (cardsList.length) {
      throw new AppError(400, 'Bad request: Duplicate card number');
    }
    
    return await this._getModel().create(data);
  }
  
  /**
   * Mobile operation (payment/refill). Creates new transaction and changes card balance.
   * @param {Number} id Card id
   * @param {Object} data Operation data
   * @param {String} mode Mobile operation mode: 'PAYMENT' or 'REFILL'
   * @returns {Promise.<void>}
   */
  async mobile(id, data, mode) {
    if (!['PAYMENT', 'REFILL'].includes(mode)) {
      throw new AppError(500, 'Bad mobile operation');
    }
    
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, 'Bad request: Id must be a positive integer');
    }
    
    if (!data || !data.amount || typeof data.amount !== 'number') {
      throw new AppError(400, 'Bad request: Payment data is invalid');
    }
  
    const card = await this._getModel().get(id);
    if (!card) {
      throw new AppError(404, `Not found: Card wasn't found by id ${id}`);
    }
    
    if (card.balance < data.amount) {
      throw new AppError(403, 'Forbidden: Card balance is less than payment amount');
    }
    
    let transactionType;
  
    if (mode === 'PAYMENT') {
      card.balance -= data.amount;
      transactionType = 'paymentMobile';
    }
    
    if (mode === 'REFILL') {
      card.balance += data.amount;
      transactionType = 'refillMobile';
    }
    
    await this._getModel().update(card);
  
    const transaction = {
      cardId: card.id,
      data: '+7(999)111-22-33',
      type: transactionType,
      time: (new Date()).toISOString(),
      sum: data.amount,
    };
  
    await this._getTransactionsModel().create(transaction);
  }
  
  /**
   * Validates card data
   * @param {Object} data
   * @returns {Boolean} validation flag
   */
  _isDataValid(data) {
    if (!data) return false;
    const { cardNumber, balance } = data;
    return typeof cardNumber === 'string'
      && cardNumber.length === 16
      && typeof balance === 'number';
  }
  
  /**
   * Validates card number with Luhn algorithm
   * @param {Object} data
   * @returns {Boolean} validation flag
   */
  _isLuhnValid(data) {
    const sum = data.cardNumber.split('').reduce((s, elem, index) => {
      let val = Number(elem);
      if (index % 2 === 0) val *= 2;
      if (val > 9) val -= 9;
      return s + val;
    }, 0);
    return sum % 10 === 0;
  }
  
  /**
   * Returns TransactionsModel instance
   * @returns {Object}
   * @private
   */
  _getTransactionsModel() {
    return this._transactionsModel;
  }
}

module.exports = CardsService;
