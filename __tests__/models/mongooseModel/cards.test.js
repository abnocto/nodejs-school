jest.mock('../../../source/models/db/card');

const log4js = require('log4js');

// create stubs for logger
const loggerMethods = ['info', 'warn', 'error'];
log4js.getLogger = jest.fn(() => loggerMethods.reduce((obj, key) => Object.assign(obj, { [key]: jest.fn() }), {}));

const CardsModel = require('../../../source/models/cardsModel');
const Card = require('../../../source/models/db/card');

const cardsModel = new CardsModel();

describe('Mongoose Model (common), Mongoose Model / Cards Model', () => {
  
  beforeEach(() => {
    Card.reset();
  });
  
  test('getAll()', async () => {
    const dbCards = await cardsModel.getAll();
    const dbIds = dbCards.map(dbCard => dbCard.id).sort();
    expect(dbCards).toHaveLength(3);
    expect(dbIds).toEqual([1, 2, 3]);
  });
  
  test('get(id) with existing id', async () => {
    const id = 2;
    const cardNumber = '5469250000000004';
    const balance = 226264;
    const dbCard = await cardsModel.get(id);
    expect(dbCard.id).toBe(id);
    expect(dbCard.cardNumber).toBe(cardNumber);
    expect(dbCard.balance).toBe(balance);
  });
  
  test('get(id) with nonexistent but valid id', async () => {
    const id = 5;
    const dbCard = await cardsModel.get(id);
    expect(dbCard).toBeNull();
  });
  
  test('get(id) with invalid id', async () => {
    const id = -1;
    const dbCard = await cardsModel.get(id);
    expect(dbCard).toBeNull();
  });
  
  test('getBy(key, value) with existing key and value', async () => {
    const key = 'cardNumber';
    const value = '4058700000000008';
    const id = 1;
    const balance = 700;
    const dbCards = await cardsModel.getBy(key, value);
    expect(dbCards).toHaveLength(1);
    expect(dbCards[0].id).toBe(id);
    expect(dbCards[0].cardNumber).toBe(value);
    expect(dbCards[0].balance).toBe(balance);
  });
  
  test('getBy(key, value) with nonexistent key', async () => {
    const key = 'nonExistent';
    const value = '4058700000000008';
    const dbCards = await cardsModel.getBy(key, value);
    expect(dbCards).toEqual([]);
  });
  
  test('getBy(key, value) with nonexistent value', async () => {
    const key = 'cardNumber';
    const value = 'nonExistent';
    const dbCards = await cardsModel.getBy(key, value);
    expect(dbCards).toEqual([]);
  });
  
  test('remove(id) with existing id', async () => {
    const id = 2;
    await cardsModel.remove(id);
    const dbCards = await cardsModel.getAll();
    const dbIds = dbCards.map(dbCard => dbCard.id).sort();
    expect(dbCards).toHaveLength(2);
    expect(dbIds).toEqual([1, 3]);
  });
  
  test('remove(id) with nonexistent but valid id', async () => {
    const id = 5;
    await cardsModel.remove(id);
    const dbCards = await cardsModel.getAll();
    const dbIds = dbCards.map(dbCard => dbCard.id).sort();
    expect(dbCards).toHaveLength(3);
    expect(dbIds).toEqual([1, 2, 3]);
  });
  
  test('remove(id) with invalid id', async () => {
    const id = -1;
    await cardsModel.remove(id);
    const dbCards = await cardsModel.getAll();
    const dbIds = dbCards.map(dbCard => dbCard.id).sort();
    expect(dbCards).toHaveLength(3);
    expect(dbIds).toEqual([1, 2, 3]);
  });
  
  test('create(data)', async () => {
    const expectedId = 4;
    const cardNumber = '6768030000000006';
    const balance = 120;
    const dbCard = await cardsModel.create({ cardNumber, balance });
    expect(dbCard.id).toBe(expectedId);
    expect(dbCard.cardNumber).toBe(cardNumber);
    expect(dbCard.balance).toBe(balance);
    const dbCards = await cardsModel.getAll();
    const dbIds = dbCards.map(dbCard => dbCard.id).sort();
    expect(dbCards).toHaveLength(4);
    expect(dbIds).toEqual([1, 2, 3, expectedId].sort());
    expect(dbCards.find(card => card.id === dbCard.id)).toEqual(dbCard);
  });
  
  test('update(object) with existing object id', async () => {
    const id = 3;
    const cardNumber = '6762300000000009';
    const balance = 777;
    const dbCard = await cardsModel.update({ id, cardNumber, balance });
    expect(dbCard.id).toBe(id);
    expect(dbCard.cardNumber).toBe(cardNumber);
    expect(dbCard.balance).toBe(balance);
    const dbCards = await cardsModel.getAll();
    const dbIds = dbCards.map(dbCard => dbCard.id).sort();
    expect(dbCards).toHaveLength(3);
    expect(dbIds).toEqual([1, 2, 3]);
    expect(dbCards.find(card => card.id === dbCard.id)).toEqual(dbCard);
  });
  
  test('update(object) with nonexistent but valid object id', async () => {
    const id = 5;
    const cardNumber = '6762300000000009';
    const balance = 777;
    const dbCard = await cardsModel.update({ id, cardNumber, balance });
    expect(dbCard.id).toBe(id);
    expect(dbCard.cardNumber).toBe(cardNumber);
    expect(dbCard.balance).toBe(balance);
    const dbCards = await cardsModel.getAll();
    const dbIds = dbCards.map(dbCard => dbCard.id).sort();
    expect(dbCards).toHaveLength(3);
    expect(dbIds).toEqual([1, 2, 3]);
    expect(dbCards.find(card => card.id === dbCard.id)).toBeUndefined();
  });
  
  test('update(object) with invalid object id', async () => {
    const id = -1;
    const cardNumber = '6762300000000009';
    const balance = 777;
    const dbCard = await cardsModel.update({ id, cardNumber, balance });
    expect(dbCard.id).toBe(id);
    expect(dbCard.cardNumber).toBe(cardNumber);
    expect(dbCard.balance).toBe(balance);
    const dbCards = await cardsModel.getAll();
    const dbIds = dbCards.map(dbCard => dbCard.id).sort();
    expect(dbCards).toHaveLength(3);
    expect(dbIds).toEqual([1, 2, 3]);
    expect(dbCards.find(card => card.id === dbCard.id)).toBeUndefined();
  });
  
});
