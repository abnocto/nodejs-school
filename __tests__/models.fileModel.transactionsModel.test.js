const fs = require('fs');
const TransactionsModel = require('../source/models/transactionsModel');
const AppError = require('../libs/appError');

const transactionsModel = new TransactionsModel();

let transactions = [
  { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-10-04T05:28:31+03:00', sum: 2345, id: 1 },
];

fs.readFile = jest.fn((path, callback) => {
  callback(null, JSON.stringify(transactions));
});

fs.writeFile = jest.fn((path, dataJSON, callback) => {
  transactions = JSON.parse(dataJSON);
  callback(null);
});

describe('File Model tests (general tests with cardsModel)', () => {
  
  test('getAll()', () => expect(transactionsModel.getAll()).resolves.toEqual(transactions));
  
  test('remove(id) is forbidden for transactions', () => {
    const err = new AppError(403, 'Forbidden: Transaction removing is forbidden');
    return expect(transactionsModel.remove(1)).rejects.toEqual(err);
  });
  
  test('update(object) is forbidden for transactions', () => {
    const err = new AppError(403, 'Forbidden: Transaction updating is forbidden');
    return expect(transactionsModel.update({})).rejects.toEqual(err);
  });
  
});
