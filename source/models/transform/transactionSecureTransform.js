const ObjectTransform = require('./common/objectTransform');
const { securify } = require('../../../libs/bankUtils');

class TransactionSecureTransform extends ObjectTransform {
  _write(transaction, encoding, done) {
    this.push(Object.assign({}, transaction, { data: transaction.type === 'card2Card' ? securify(transaction.data) : transaction.data }));
    done();
  }
}

module.exports = () => new TransactionSecureTransform();
