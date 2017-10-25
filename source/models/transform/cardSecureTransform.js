const ObjectTransform = require('./common/objectTransform');
const { securify } = require('../../../libs/bankUtils');

class CardSecureTransform extends ObjectTransform {
  _write(card, encoding, done) {
    this.push(Object.assign({}, card, { cardNumber: securify(card.cardNumber) }));
    done();
  }
}

module.exports = () => new CardSecureTransform();
