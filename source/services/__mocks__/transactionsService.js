const objects = [
  { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-10-04T05:28:31+03:00', sum: 2345, id: 1 },
];

class TransactionsService {
  
  async getAll() {
    return Promise.resolve(objects);
  }
  
  async get(id) {
    return Promise.resolve(objects.find(object => object.id === id));
  }
  
  async getBy(key, value) {
    return Promise.resolve(objects.filter(object => object[key] === value));
  }
  
  async remove(id) {
    return Promise.reject();
  }
  
  async create(data, cardId) {
    return Promise.resolve(data);
  }
  
}

module.exports = TransactionsService;
