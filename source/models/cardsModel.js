const MongooseModel = require('./common/mongooseModel');
const Card = require('../data/domain/card');

const toClient = (card) => {
  if (!card) return null;
  return {
    id: card.id,
    cardNumber: card.cardNumber,
    balance: card.balance,
  };
};

class CardsModel extends MongooseModel {
  constructor() {
    super(Card, toClient);
  }
}

module.exports = CardsModel;
