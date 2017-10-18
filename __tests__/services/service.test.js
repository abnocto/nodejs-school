jest.mock('../../source/models/cardsModel');
jest.mock('../../source/models/transactionsModel');

const CardsService = require('../../source/services/cardsService');
const AppError = require('../../libs/appError');

const cardsService = new CardsService();

describe('Service', () => {
  
  test('getAll', async () => {
    const cards = await cardsService.getAll();
    expect(cards).toBeInstanceOf(Array);
    expect(cards).toHaveLength(3);
  });
  
  describe('get(id)', () => {
    
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
        const err = new AppError(400, 'Bad request: Id must be a positive integer');
        return expect(cardsService.get(id)).rejects.toEqual(err);
      });
    });
    
    test(' - with valid id and for nonexistent id', () => {
      const id = 1000;
      const err = new AppError(404, `Not found: Wasn't found by id ${id}`);
      return expect(cardsService.get(id)).rejects.toEqual(err);
    });
    
    test(' - with valid id and for existing id', async () => {
      const id = 2;
      const card = await cardsService.get(id);
      expect(card).toBeInstanceOf(Object);
    });
    
  });
  
  describe('getBy(key, value)', () => {
    
    const invalidKeys = [
      -1,
      2.5,
      0,
      /key/,
      null,
      undefined,
      {},
      ['key'],
    ];
    
    invalidKeys.forEach((key, index) => {
      test(` - with invalid key #${index + 1}`, () => {
        const err = new AppError(400, 'Bad request: Key must be a string');
        return expect(cardsService.getBy(key, 'value')).rejects.toEqual(err);
      });
    });
    
    const invalidValues = [
      /key/,
      null,
      undefined,
      {},
      ['key'],
    ];
    
    invalidValues.forEach((value, index) => {
      test(` - with invalid value #${index + 1}`, () => {
        const err = new AppError(400, 'Bad request: Value must be a string or a number');
        return expect(cardsService.getBy('key', value)).rejects.toEqual(err);
      });
    });
    
    const validData = [
      ['key', 'value'],
      ['a', 'anotherValue'],
      ['b', 0],
      ['c', -2.5],
      ['abcd', 100],
    ];
    
    validData.forEach((data, index) => {
      test(` - with valid keys and values and for nonexistent objects #${index + 1}`, async () => {
        const [key, value] = data;
        const cards = await cardsService.getBy(key, value);
        expect(cards).toBeInstanceOf(Array);
        expect(cards).toHaveLength(0);
      });
    });
    
    test(' - with valid key and value and for existing objects', async () => {
      const key = 'balance';
      const value = 700;
      const cards = await cardsService.getBy(key, value);
      expect(cards).toBeInstanceOf(Array);
      expect(cards).not.toHaveLength(0);
    });
    
  });
  
  describe('remove(id)', () => {
    
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
        const err = new AppError(400, 'Bad request: Id must be a positive integer');
        return expect(cardsService.remove(id)).rejects.toEqual(err);
      });
    });
    
    test(' - with valid id and for nonexistent id', () => {
      const id = 1000;
      const err = new AppError(404, `Not found: Wasn't found by id ${id}`);
      return expect(cardsService.remove(id)).rejects.toEqual(err);
    });
    
    test(' - with valid id and for existing id', () => {
      const id = 2;
      return expect(cardsService.remove(id)).resolves.toBeUndefined();
    });
    
  });
  
});
