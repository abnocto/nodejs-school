const Model = require('./model');
const Card = require('./card');

class TransactionModel extends Model {
  
  create(data) {
    let transactionData = data.data;
    
    if (typeof transactionData === 'object' && transactionData.cardId) {
      const dataCard = Card.findOne({ id: transactionData.cardId });
      if (dataCard) {
        transactionData = dataCard.cardNumber;
      } else {
        transactionData = String(this.data.cardId);
      }
    }
    
    const obj = Object.assign(
      {},
      data,
      {
        id: Math.max(...this._objects.map(obj => obj.id), 0) + 1,
        data: transactionData,
      },
    );
    this._objects.push(obj);
    return obj;
  }
  
}

module.exports = new TransactionModel([
  {
    id: 1,
    cardId: 1,
    type: 'prepaidCard',
    data: '220003000000003',
    time: '2017-10-04T05:28:31+03:00',
    sum: 2345,
  },
  {
    id: 2,
    cardId: 1,
    type: 'card2Card',
    data: '220003000000012',
    time: '2017-10-04T05:28:31+03:00',
    sum: 34565,
  },
]);
