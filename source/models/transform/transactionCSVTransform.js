const ObjectTransform = require('./common/objectTransform');

class TransactionCSVTransform extends ObjectTransform {
  _write(transaction, encoding, done) {
    this.push(`${Object.values(transaction).join(',')}\n`);
    done();
  }
}

module.exports = () => new TransactionCSVTransform();
