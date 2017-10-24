const MongooseModel = require('./common/mongooseModel');
const Card = require('./db/card');

const toClient = (obj) => {
  if (!obj) return null;
  return {
    id: obj.id,
    cardNumber: obj.cardNumber,
    balance: obj.balance,
  };
};

class CardsModel extends MongooseModel {
  constructor() {
    super(Card, toClient);
  }
}

module.exports = CardsModel;
