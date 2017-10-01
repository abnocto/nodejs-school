const AppError = require('../../libs/appError');

const Service = require('./common/service');
const CardsModel = require('../models/cardsModel');

class CardsService extends Service {
  constructor() {
    super(new CardsModel());
  }
  
  /**
   * Creates new card by data
   * @param data Data to create card with
   * @returns {Promise.<Object>}
   */
  async create(data) {
    if (!this.isDataValid(data)) {
      throw new AppError(400, 'Bad request: Card data is invalid');
    }
  
    if (!this.isLuhnValid(data)) {
      throw new AppError(400, 'Bad request: Card number is invalid');
    }
    
    const cardsList = await this._getModel().getBy('cardNumber', data.cardNumber);
    if (cardsList.length) {
      throw new AppError(400, 'Bad request: Duplicate card number');
    }
    
    return await this._getModel().create(data);
  }
  
  /**
   * Validates card data
   * @param {Object} data
   * @returns {Boolean} validation flag
   */
  isDataValid(data) {
    if (!data) return false;
    const { cardNumber, balance } = data;
    return typeof cardNumber === 'string'
      && cardNumber.length === 16
      && Number.isInteger(balance);
  }
  
  /**
   * Validates card number with Luhn algorithm
   * @param {Object} data
   * @returns {Boolean} validation flag
   */
  isLuhnValid(data) {
    const sum = data.cardNumber.split('').reduce((s, elem, index) => {
      let val = Number(elem);
      if (index % 2 === 0) val *= 2;
      if (val > 9) val -= 9;
      return s + val;
    }, 0);
    return sum % 10 === 0;
  }
}

module.exports = CardsService;
