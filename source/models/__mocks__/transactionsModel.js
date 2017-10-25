const cards = [
  { cardNumber: '5469250000000004', balance: 226264, id: 1 },
  { cardNumber: '6762300000000009', balance: 88, id: 2 },
  { cardNumber: '4058700000000008', balance: 700, id: 3 },
];

const objects = [
  { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-10-04T05:28:31+03:00', sum: 2345, id: 1 },
];

class TransactionsModel {
  
  async getAll() {
    return Promise.resolve(objects);
  }
  
  async get(id) {
    return Promise.resolve(objects.find(object => object.id === id));
  }
  
  async getBy(key, value) {
    return Promise.resolve(objects.filter(object => object[key] === value));
  }
  
  async create(transaction) {
    if (typeof transaction.data === 'object' && transaction.data.cardId) {
      transaction.data = cards.find(card => card.id === transaction.data.cardId).cardNumber;
    }
    return Promise.resolve(transaction);
  }
  
  async update(data) {
    return Promise.reject();
  }
  
  async remove(id) {
    return Promise.reject();
  }
  
}

module.exports = TransactionsModel;
