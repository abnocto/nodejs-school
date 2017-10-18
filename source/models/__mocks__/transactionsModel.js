const objects = [
  { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-10-04T05:28:31+03:00', sum: 2345, id: 1 },
];

class TransactionsModel {
  
  getAll() {
    return Promise.resolve(objects);
  }
  
  get(id) {
    return Promise.resolve(objects.find(object => object.id === id));
  }
  
  getBy(key, value) {
    return Promise.resolve(objects.filter(object => object[key] === value));
  }
  
  create(data) {
    return Promise.resolve(data);
  }
  
  update(data) {
    return Promise.reject();
  }
  
  remove(id) {
    return Promise.reject();
  }
  
}

module.exports = TransactionsModel;
