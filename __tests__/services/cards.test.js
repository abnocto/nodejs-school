jest.mock('../../source/models/cardsModel');
jest.mock('../../source/models/transactionsModel');

const CardsService = require('../../source/services/cardsService');
const AppError = require('../../libs/appError');

const cardsService = new CardsService();

describe('Service / Cards Service', () => {
  
  describe('create(data)', () => {
    
    const invalidData = [
      {},
      { cardNumber: '1' },
      { cardNumber: 1 },
      { balance: '1' },
      { balance: 1 },
      { cardNumber: '1', balance: 1 },
      { cardNumber: '1', balance: 'text' },
      { cardNumber: 'text', balance: 1 },
      { cardNumber: '1', balance: 1 },
      { cardNumber: '12345', balance: '12345' },
      { cardNumber: '4111111111111111', balance: '12345' },
    ];
    
    invalidData.forEach((data, index) => {
      test(` - with invalid data #${index + 1}`, () => {
        const err = new AppError(400, 'Bad request: Card data is invalid');
        return expect(cardsService.create(data)).rejects.toEqual(err);
      });
    });
    
    const invalidNumbers = [
      { cardNumber: '1234123412341234', balance: 12345 },
      { cardNumber: '1535153515351535', balance: 12345 },
      { cardNumber: '5678434234763470', balance: 1234 },
      { cardNumber: '0942341537482374', balance: 99999999 },
      { cardNumber: '5742387195357823', balance: 0 },
    ];
  
    invalidNumbers.forEach((data, index) => {
      test(` - with invalid number #${index + 1}`, () => {
        const err = new AppError(400, 'Bad request: Card number is invalid');
        return expect(cardsService.create(data)).rejects.toEqual(err);
      });
    });
  
    const duplicateNumbers = [
      { cardNumber: '5469250000000004', balance: 1234 },
      { cardNumber: '6762300000000009', balance: 2345 },
      { cardNumber: '4058700000000008', balance: 3456 },
    ];
  
    duplicateNumbers.forEach((data, index) => {
      test(` - with duplicate number #${index + 1}`, () => {
        const err = new AppError(400, 'Bad request: Duplicate card number');
        return expect(cardsService.create(data)).rejects.toEqual(err);
      });
    });
    
    const validData = [
      { cardNumber: '5500640000000007', balance: 2 },
      { cardNumber: '4377840000000006', balance: 4545 },
      { cardNumber: '6768030000000006', balance: 120 },
    ];
    
    validData.forEach((data, index) => {
      test(` - with valid data #${index + 1}`, () => {
        const expected = Object.assign({}, data);
        return expect(cardsService.create(data)).resolves.toEqual(expected);
      });
    });
    
  });
  
  describe('mobile(id, data, mode)', () => {
  
    test(' - with bad operation', () => {
      const id = 1;
      const data = { sum: 1000, data: '+79991234567' };
      const mode = 'FOO';
      const err = new AppError(500, 'Bad mobile operation');
      return expect(cardsService.mobile(id, data, mode)).rejects.toEqual(err);
    });
  
    const invalidIds = [
      -1,
      2.5,
      0,
      '1',
      'abc',
      null,
      undefined,
      {},
      [],
    ];
  
    invalidIds.forEach((id, index) => {
      test(` - with invalid id #${index + 1}`, () => {
        const data = { sum: 1000, data: '+79991234567' };
        const mode = 'PAYMENT';
        const err = new AppError(400, 'Bad request: Id must be a positive integer');
        return expect(cardsService.mobile(id, data, mode)).rejects.toEqual(err);
      });
    });
    
    const invalidData = [
      { sum: 'abc', data: '+79991234567' },
      { sum: null, data: '+79991234567' },
      { sum: undefined, data: '+79991234567' },
      { sum: '1000', data: '+79991234567' },
      { sum: [], data: '+79991234567' },
      { sum: [100], data: '+79991234567' },
      { sum: {}, data: '+79991234567' },
      { sum: 0, data: '+79991234567' },
      { sum: -20, data: '+79991234567' },
      { sum: 100, data: ['data'] },
      { sum: 100, data: {} },
      { sum: 100, data: null },
      { sum: 100, data: 79991234567 },
      { sum: 100, data: undefined },
    ];
  
    invalidData.forEach((data, index) => {
      test(` - with invalid data #${index + 1}`, () => {
        const id = 1;
        const mode = 'PAYMENT';
        const err = new AppError(400, 'Bad request: Mobile operation data is invalid');
        return expect(cardsService.mobile(id, data, mode)).rejects.toEqual(err);
      });
    });
    
    test(' - with valid args and for nonexistent card id', () => {
      const id = 1000;
      const data = { sum: 1000, data: '+79991234567' };
      const mode = 'PAYMENT';
      const err = new AppError(404, `Not found: Card wasn't found by id ${id}`);
      return expect(cardsService.mobile(id, data, mode)).rejects.toEqual(err);
    });
    
    test(' - with PAYMENT mode and card balance less than payment sum', () => {
      const id = 1;
      const data = { sum: Infinity, data: '+79991234567' };
      const mode = 'PAYMENT';
      const err = new AppError(403, 'Forbidden: Card balance is less than payment sum');
      return expect(cardsService.mobile(id, data, mode)).rejects.toEqual(err);
    });
    
    const validCases = [
      { id: 1, data: { sum: 100, data: '+79991234556' }, mode: 'PAYMENT' },
      { id: 1, data: { sum: 100, data: '+79991234556' }, mode: 'REFILL' },
      { id: 1, data: { sum: 10000000, data: '+79991234556' }, mode: 'REFILL' },
    ];
    
    validCases.forEach((validCase, index) => {
      test(` - with valid case #${index + 1}`, async () => {
        const { id, data, mode } = validCase;
        const cardBefore = Object.assign({}, await cardsService.get(id));
        const result = await cardsService.mobile(id, data, mode);
        const { cards, transactions } = result;
        const [card] = cards;
        const [transaction] = transactions;
        // result must be an object { cards: [card], transactions: [transaction] }
        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty('cards', expect.any(Array));
        expect(result).toHaveProperty('transactions', expect.any(Array));
        // card must save all data, but change balance (balance + refill sum on REFILL, balance - payment sum on PAYMENT)
        expect(card.cardNumber).toEqual(cardBefore.cardNumber);
        expect(card.balance).toEqual(cardBefore.balance + data.sum * (mode === 'REFILL' ? 1 : -1));
        // transaction must have cardId prop equals to card id, data prop equals to data.data (mobile phone number),
        // sum equals to balance + refill sum on REFILL, balance - payment sum on PAYMENT
        expect(transaction.cardId).toEqual(card.id);
        expect(transaction.data).toEqual(data.data);
        expect(transaction.sum).toEqual(data.sum * (mode === 'REFILL' ? 1 : -1));
      });
    });
  
  });
  
  describe('transfer(id, data)', () => {
    
    const invalidIds = [
      -1,
      2.5,
      0,
      '1',
      'abc',
      null,
      undefined,
      {},
      [],
    ];
    
    invalidIds.forEach((id, index) => {
      test(` - with invalid id #${index + 1}`, () => {
        const data = {};
        const err = new AppError(400, 'Bad request: Id must be a positive integer');
        return expect(cardsService.transfer(id, data)).rejects.toEqual(err);
      });
    });
    
    const invalidData = [
      { sum: 'abc', receiverCardId: 2 },
      { sum: null, receiverCardId: 2 },
      { sum: undefined, receiverCardId: 2 },
      { sum: '1000', receiverCardId: 2 },
      { sum: [], receiverCardId: 2 },
      { sum: [100], receiverCardId: 2 },
      { sum: {}, receiverCardId: 2 },
      { sum: 0, receiverCardId: 2 },
      { sum: -20, receiverCardId: 2 },
      { sum: 100, receiverCardId: [2] },
      { sum: 100, receiverCardId: {} },
      { sum: 100, receiverCardId: null },
      { sum: 100, receiverCardId: '2' },
      { sum: 100, receiverCardId: undefined },
    ];
    
    invalidData.forEach((data, index) => {
      test(` - with invalid data #${index + 1}`, () => {
        const id = 1;
        const err = new AppError(400, 'Bad request: Transfer operation data is invalid');
        return expect(cardsService.transfer(id, data)).rejects.toEqual(err);
      });
    });
    
    test(' - with valid args and for nonexistent card sender id', () => {
      const id = 1000;
      const data = { sum: 1000, receiverCardId: 2 };
      const err = new AppError(404, `Not found: Card (sender) wasn't found by id ${id}`);
      return expect(cardsService.transfer(id, data)).rejects.toEqual(err);
    });
  
    test(' - with valid args and for nonexistent card receiver id', () => {
      const id = 1;
      const data = { sum: 1000, receiverCardId: 2000 };
      const err = new AppError(404, `Not found: Card (receiver) wasn't found by id ${data.receiverCardId}`);
      return expect(cardsService.transfer(id, data)).rejects.toEqual(err);
    });

    test(' - with sender card balance less than transfer sum', () => {
      const id = 1;
      const data = { sum: Infinity, receiverCardId: 2 };
      const err = new AppError(403, 'Forbidden: Card (sender) balance is less than payment amount');
      return expect(cardsService.transfer(id, data)).rejects.toEqual(err);
    });

    const validCases = [
      { id: 1, data: { sum: 100, receiverCardId: 2 } },
      { id: 1, data: { sum: 1.5, receiverCardId: 3 } },
      { id: 2, data: { sum: 40, receiverCardId: 1 } },
      { id: 3, data: { sum: 200, receiverCardId: 2 } },
    ];

    validCases.forEach((validCase, index) => {
      test(` - with valid case #${index + 1}`, async () => {
        const { id, data } = validCase;
        const senderCardBefore = Object.assign({}, await cardsService.get(id));
        const receiverCardBefore = Object.assign({}, await cardsService.get(data.receiverCardId));
        const result = await cardsService.transfer(id, data);
        const { cards, transactions } = result;
        const [senderCard, receiverCard] = cards;
        const [senderTransaction, receiverTransaction] = transactions;
        // result must be an object { cards: [senderCard, receiverCard], transactions: [senderTransaction, receiverTransaction] }
        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty('cards', expect.any(Array));
        expect(result).toHaveProperty('transactions', expect.any(Array));
        // sender card id must save all data, but change balance (balance - transfer sum)
        expect(senderCard.cardNumber).toEqual(senderCardBefore.cardNumber);
        expect(senderCard.balance).toEqual(senderCardBefore.balance - data.sum);
        // receiver card id must save all data, but change balance (balance + transfer sum)
        expect(receiverCard.cardNumber).toEqual(receiverCardBefore.cardNumber);
        expect(receiverCard.balance).toEqual(receiverCardBefore.balance + data.sum);
        // sender transaction must have cardId prop equals to sender card id, data prop equals to receiver card number and sum equals to transfer sum * -1
        expect(senderTransaction.cardId).toEqual(senderCard.id);
        expect(senderTransaction.data).toEqual(receiverCard.cardNumber);
        expect(senderTransaction.sum).toEqual(-1 * data.sum);
        // receiver transaction must have cardId prop equals to receiver card id, data prop equals to sender card number and sum equals to transfer sum
        expect(receiverTransaction.cardId).toEqual(receiverCard.id);
        expect(receiverTransaction.data).toEqual(senderCard.cardNumber);
        expect(receiverTransaction.sum).toEqual(data.sum);
      });
    });
    
  });
  
});
