const ObjectTransform = require('./common/objectTransform');

class TransactionHistoryTransform extends ObjectTransform {
  _write(transaction, encoding, done) {
    const time = new Date(transaction.time);
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const millis = time.getMilliseconds();
    const timeString = `${hours}:${minutes}:${seconds}.${millis}`;
    this.push({
      type: transaction.type,
      data: transaction.data,
      time: timeString,
      sum: transaction.sum,
    });
    done();
  }
}

module.exports = () => new TransactionHistoryTransform();
