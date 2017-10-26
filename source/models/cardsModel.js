const MongooseModel = require('./common/mongooseModel');
const Card = require('./db/card');
const cardClientTransformer = require('./transform/cardClientTransform');
const cardSecureTransformer = require('./transform/cardSecureTransform');

class CardsModel extends MongooseModel {
  constructor() {
    super(Card, [cardClientTransformer, cardSecureTransformer]);
  }
}

module.exports = CardsModel;
