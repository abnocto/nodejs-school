const MongooseModel = require('./common/mongooseModel');
const Card = require('./db/card');
const cardClientTransformer = require('./transform/cardClientTransform');
const cardSecureTransformer = require('./transform/cardSecureTransform');
const { securify } = require('../../libs/bankUtils');

class CardsModel extends MongooseModel {
  constructor() {
    super(Card, [cardClientTransformer, cardSecureTransformer]);
  }
  
  /**
   * Creates new db card object by data
   * @param {Object} data Card data to create card with
   * @returns {Promise.<Object>}
   */
  async create(data) {
    const card = await super.create(data);
    return Object.assign({}, card, { cardNumber: securify(card.cardNumber) });
  }
}

module.exports = CardsModel;
