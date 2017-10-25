const ObjectTransform = require('./common/objectTransform');

class TransactionClientTransform extends ObjectTransform {
  _write(transaction, encoding, done) {
    this.push({
      id: transaction.id,
      cardId: transaction.cardId,
      type: transaction.type,
      data: transaction.data,
      time: transaction.time,
      sum: transaction.sum,
    });
    done();
  }
}

module.exports = () => new TransactionClientTransform();
