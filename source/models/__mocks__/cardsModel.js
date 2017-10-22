const objects = [
  { cardNumber: '5469250000000004', balance: 226264, id: '1' },
  { cardNumber: '6762300000000009', balance: 88, id: '2' },
  { cardNumber: '4058700000000008', balance: 700, id: '3' },
];

class CardsModel {
  
  async getAll() {
    return Promise.resolve(objects);
  }
  
  async get(id) {
    return Promise.resolve(objects.find(object => object.id === id));
  }
  
  async getBy(key, value) {
    return Promise.resolve(objects.filter(object => object[key] === value));
  }
  
  async create(data) {
    return Promise.resolve(data);
  }
  
  async update(data) {
    return Promise.resolve(data);
  }
  
  async remove(id) {
    return Promise.resolve();
  }
  
}

module.exports = CardsModel;
