const AppError = require('../../libs/appError');

const Service = require('./common/service');

class CardsService extends Service {
  constructor({ cardsModel, transactionsModel }) {
    super(cardsModel);
    this._transactionsModel = transactionsModel;
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
   * @returns {Promise.<Object>}
   */
  async mobile(id, data, mode) {
    if (!['PAYMENT', 'REFILL'].includes(mode)) {
      throw new AppError(500, 'Bad mobile operation');
    }
    
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, 'Bad request: Id must be a positive integer');
    }
  
    if (!data
      || typeof data.sum !== 'number' || data.sum <= 0
      || typeof data.data !== 'string') {
      throw new AppError(400, 'Bad request: Mobile operation data is invalid');
    }
  
    const card = await this._getModel().get(id);
    if (!card) {
      throw new AppError(404, `Not found: Card wasn't found by id ${id}`);
    }
    
    if (mode === 'PAYMENT' && card.balance < data.sum) {
      throw new AppError(403, 'Forbidden: Card balance is less than payment sum');
    }
    
    let transactionSum;
  
    if (mode === 'PAYMENT') {
      transactionSum = -data.sum;
    }
    
    if (mode === 'REFILL') {
      transactionSum = data.sum;
    }
  
    card.balance += transactionSum;
    await this._getModel().update(card.id, { balance: card.balance }, true);
  
    const transactionData = {
      cardId: card.id,
      data: data.data,
      type: 'paymentMobile',
      time: (new Date()).toISOString(),
      sum: transactionSum,
    };
  
    const transaction = await this._getTransactionsModel().create(transactionData);
    
    return {
      cards: [card],
      transactions: [transaction],
    };
  }
  
  /**
   * Transfer operation. Creates two transactions for each card, changes cards balances.
   * @param {Number} id Card id
   * @param {Object} data Operation data
   * @returns {Promise.<Object>}
   */
  async transfer(id, data) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(400, 'Bad request: Id must be a positive integer');
    }
  
    if (!data
      || !data.sum || typeof data.sum !== 'number' || data.sum <= 0
      || !data.receiverCardId || typeof data.receiverCardId !== 'number' || data.receiverCardId <= 0) {
      throw new AppError(400, 'Bad request: Transfer operation data is invalid');
    }
  
    const cardSender = await this._getModel().get(id);
    if (!cardSender) {
      throw new AppError(404, `Not found: Card (sender) wasn't found by id ${id}`);
    }
  
    const cardReceiver = await this._getModel().get(data.receiverCardId);
    if (!cardReceiver) {
      throw new AppError(404, `Not found: Card (receiver) wasn't found by id ${data.receiverCardId}`);
    }
  
    if (cardSender.balance < data.sum) {
      throw new AppError(403, 'Forbidden: Card (sender) balance is less than payment amount');
    }
  
    cardSender.balance -= data.sum;
    await this._getModel().update(cardSender.id, { balance: cardSender.balance }, true);
  
    cardReceiver.balance += data.sum;
    await this._getModel().update(cardReceiver.id, { balance: cardReceiver.balance }, true);
  
    const transactionForSenderData = {
      cardId: cardSender.id,
      data: {
        cardId: cardReceiver.id,
      },
      type: 'card2Card',
      time: (new Date()).toISOString(),
      sum: -data.sum,
    };
  
    const transactionForSender = await this._getTransactionsModel().create(transactionForSenderData);
  
    const transactionForReceiverData = {
      cardId: cardReceiver.id,
      data: {
        cardId: cardSender.id,
      },
      type: 'card2Card',
      time: (new Date()).toISOString(),
      sum: data.sum,
    };
  
    const transactionForReceiver = await this._getTransactionsModel().create(transactionForReceiverData);
    
    return {
      cards: [cardSender, cardReceiver],
      transactions: [transactionForSender, transactionForReceiver],
    };
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
