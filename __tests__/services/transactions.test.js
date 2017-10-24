jest.mock('../../source/models/cardsModel');
jest.mock('../../source/models/transactionsModel');

const CardsModel = require('../../source/models/cardsModel');
const TransactionsModel = require('../../source/models/transactionsModel');
const TransationsService = require('../../source/services/transactionsService');
const AppError = require('../../libs/appError');

const cardsModel = new CardsModel();
const transactionsModel = new TransactionsModel();
const transactionsService = new TransationsService({ cardsModel, transactionsModel });

describe('Service / Transactions Service', () => {
  
  describe('create(data)', () => {
    
    const invalidData = [
      {},
      { cardId: '1' },
      { type: 'prepaidCard' },
      { data: '12345' },
      { time: '0' },
      { sum: 123 },
      { cardId: 1, type: 'prepaidCard' },
      { data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00' },
      { cardId: 1, type: 'prepaidCard', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { cardId: 1, data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: '2345' },
      { a: 'b', c: 2, data: '23423432434', time: '2017-08-9T05:28:31+03:00' },
    ];
    
    invalidData.forEach((data, index) => {
      test(` - with not all required fields #${index + 1}`, () => {
        const cardId = data.cardId || 1;
        const err = new AppError(400, 'Bad request: Transaction data doesn\'t have all required fields');
        return expect(transactionsService.create(data, cardId)).rejects.toEqual(err);
      });
    });
    
    const invalidTypes = [
      { cardId: 1, type: 'false', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { cardId: 'false', type: 'test', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { foo: 'bar', type: 'prepaidCard2Card', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
    ];
  
    invalidTypes.forEach((data, index) => {
      test(` - with invalid type #${index + 1}`, () => {
        const cardId = data.cardId || 1;
        const err = new AppError(403, 'Forbidden: Forbidden transaction type');
        return expect(transactionsService.create(data, cardId)).rejects.toEqual(err);
      });
    });
    
    const invalidSums = [
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: '2500' },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: '1000abc' },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: '0' },
    ];
    
    invalidSums.forEach((data, index) => {
      test(` - with invalid sum #${index + 1}`, () => {
        const cardId = data.cardId || 1;
        const err = new AppError(400, 'Bad request: Transaction sum is invalid');
        return expect(transactionsService.create(data, cardId)).rejects.toEqual(err);
      });
    });
  
    const invalidCardIds = [
      { type: 'prepaidCard', data: '220003000000003', sum: 1234, cardId: -1 },
      { type: 'card2Card', data: '123412341234', sum: 4343, cardId: 1000 },
    ];
  
    invalidCardIds.forEach((data, index) => {
      test(` - with invalid card id #${index + 1}`, () => {
        const cardId = data.cardId || 1;
        const err = new AppError(404, 'Not found: Card wasn\'t found by transaction card id');
        return expect(transactionsService.create(data, cardId)).rejects.toEqual(err);
      });
    });
    
    const invalidTimes = [
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: 'a', sum: 1234 },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: 'null', sum: 2345 },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: 'Object', sum: 3456 },
    ];
  
    invalidTimes.forEach((data, index) => {
      test(` - with invalid time #${index + 1}`, () => {
        const cardId = data.cardId || 1;
        const err = new AppError(400, 'Bad request: Invalid transaction time');
        return expect(transactionsService.create(data, cardId)).rejects.toEqual(err);
      });
    });
    
    const validData = [
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-10-04T05:28:31+03:00', sum: 2345 },
      { cardId: 1, type: 'paymentMobile', data: '+7(921)3333333', time: '2017-10-04T06:28:31+03:00', sum: -25 },
      { cardId: 1, type: 'card2Card', data: '220003000000005', time: '2017-10-04T13:28:31+03:00', sum: -174 },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-10-04T12:28:31+03:00', sum: 2345 },
      { cardId: 1, type: 'paymentMobile', data: '+7(921)3333333', time: '2017-10-04T11:28:31+03:00', sum: -25 },
      { cardId: 1, type: 'card2Card', data: '220003000000005', time: '2017-10-04T13:29:31+03:00', sum: -174 },
      { cardId: 1, type: 'card2Card', data: '220003000000005', time: '2017-10-04T13:28:35+03:00', sum: -174 },
      { cardId: 2, type: 'prepaidCard', data: '220003000000003', time: '2017-10-04T13:28:31+03:00', sum: 2345 },
      { cardId: 2, type: 'paymentMobile', data: '+7(921)3333333', time: '2017-10-04T13:28:31+03:00', sum: -25 },
      { cardId: 2, type: 'card2Card', data: '220003000000005', time: '2017-10-04T13:28:31+03:00', sum: -174 },
      { cardId: 2, type: 'prepaidCard', data: '220003000000003', time: '2017-10-04T13:28:31+03:00', sum: 2345 },
      { cardId: 2, type: 'paymentMobile', data: '+7(921)3333333', time: '2017-10-04T13:28:31+03:00', sum: -25 },
      { cardId: 2, type: 'card2Card', data: '220003000000005', time: '2017-10-04T13:28:31+03:00', sum: -174 },
      { cardId: 3, type: 'prepaidCard', data: '220003000000003', time: '2017-10-04T13:28:31+03:00', sum: 2345 },
      { cardId: 3, type: 'paymentMobile', data: '+7(921)3333333', time: '2017-10-04T13:28:31+03:00', sum: -25 },
    ];
    
    validData.forEach((data, index) => {
      test(` - with valid data #${index + 1}`, () => {
        const cardId = data.cardId || 1;
        const expected = Object.assign({}, data);
        return expect(transactionsService.create(data, cardId)).resolves.toEqual(expected);
      });
    });
    
  });
  
});
