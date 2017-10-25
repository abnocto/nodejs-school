const ObjectTransform = require('./common/objectTransform');

class CardClientTransform extends ObjectTransform {
  _write(card, encoding, done) {
    this.push({
      id: card.id,
      cardNumber: card.cardNumber,
      balance: card.balance,
    });
    done();
  }
}

module.exports = () => new CardClientTransform();
