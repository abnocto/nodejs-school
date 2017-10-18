const fs = require('fs');
const CardsModel = require('../../../source/models/cardsModel');

const cardsModel = new CardsModel();

let cards = [
  { cardNumber: '5469250000000004', balance: 226264, id: 1 },
  { cardNumber: '6762300000000009', balance: 88, id: 2 },
  { cardNumber: '4058700000000008', balance: 700, id: 3 },
];

fs.readFile = jest.fn((path, callback) => {
  callback(null, JSON.stringify(cards));
});

fs.writeFile = jest.fn((path, dataJSON, callback) => {
  cards = JSON.parse(dataJSON);
  callback(null);
});

describe('File Model, File Model / Cards Model', () => {
  
  test('getAll()', () => expect(cardsModel.getAll()).resolves.toEqual(cards));
  
  test('get(id) with existing id', () => {
    const id = 2;
    const expected = cards.find(card => card.id === id);
    return expect(cardsModel.get(id)).resolves.toEqual(expected);
  });
  
  test('get(id) with nonexistent id', () => {
    const id = -1;
    return expect(cardsModel.get(id)).resolves.toBeUndefined();
  });
  
  test('getBy(key, value) with existing key and value', () => {
    const key = 'cardNumber';
    const value = '4058700000000008';
    const expected = cards.filter(card => card[key] === value);
    return expect(cardsModel.getBy(key, value)).resolves.toEqual(expected);
  });
  
  test('getBy(key, value) with nonexistent key', () => {
    const key = 'nonExistent';
    const value = '4058700000000008';
    return expect(cardsModel.getBy(key, value)).resolves.toEqual([]);
  });
  
  test('getBy(key, value) with nonexistent value', () => {
    const key = 'cardNumber';
    const value = 'nonExistent';
    return expect(cardsModel.getBy(key, value)).resolves.toEqual([]);
  });
  
  test('remove(id) with existing id', async () => {
    const id = 2;
    const expected = cards.filter(card => card.id !== id);
    await cardsModel.remove(id);
    expect(await cardsModel.getAll()).toEqual(expected);
  });
  
  test('remove(id) with nonexistent id', async () => {
    const id = -1;
    const expected = cards.slice();
    await cardsModel.remove(id);
    expect(await cardsModel.getAll()).toEqual(expected);
  });
  
  test('create(data)', async () => {
    const data = { cardNumber: '6768030000000006', balance: 120 };
    const expectedCard = Object.assign({}, data, { id: 4 });
    const expectedCards = [...cards, expectedCard];
    const card = await cardsModel.create(data);
    expect(card).toEqual(expectedCard);
    expect(await cardsModel.getAll()).toEqual(expectedCards);
  });
  
  test('update(object) with existing object id', async () => {
    const expectedCard = Object.assign({}, cards[0], { balance: cards[0].balance + 1000 });
    const expectedCards = cards.filter(card => card.id !== cards[0].id).concat(expectedCard).sort((a, b) => a.id - b.id);
    const card = await cardsModel.update(expectedCard);
    expect(card).toEqual(expectedCard);
    expect(await cardsModel.getAll()).toEqual(expectedCards);
  });
  
  test('update(object) with nonexistent object id', async () => {
    const expectedCard = { id: -1, cardNumber: '6768030000000006', balance: 120 };
    const expectedCards = cards.slice();
    const card = await cardsModel.update(expectedCard);
    expect(card).toEqual(expectedCard);
    expect(await cardsModel.getAll()).toEqual(expectedCards);
  });
  
});
