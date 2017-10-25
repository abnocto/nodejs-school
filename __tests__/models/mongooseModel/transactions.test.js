jest.mock('../../../source/models/db/card');
jest.mock('../../../source/models/db/transaction');

const CardsModel = require('../../../source/models/cardsModel');
const TransactionsModel = require('../../../source/models/transactionsModel');
const Card = require('../../../source/models/db/card');
const Transaction = require('../../../source/models/db/transaction');
const AppError = require('../../../libs/appError');
const { securify } = require('../../../libs/bankUtils');

const cardsModel = new CardsModel();
const transactionsModel = new TransactionsModel();

describe('Mongoose Model / Transactions Model', () => {
  
  beforeEach(() => {
    Card.reset();
    Transaction.reset();
  });
  
  test('getAll()', async () => {
    const dbTransactions = await transactionsModel.getAll();
    const dbIds = dbTransactions.map(dbTransaction => dbTransaction.id).sort();
    expect(dbTransactions).toHaveLength(2);
    expect(dbIds).toEqual([1, 2]);
  });
  
  test('get transaction by id, get card by transaction', async () => {
    const id = 1;
    const dbTransaction = await transactionsModel.get(id);
    expect(dbTransaction.id).toBe(id);
    expect(dbTransaction.type).toBe('prepaidCard');
    expect(dbTransaction.sum).toBe(2345);
    const dbCard = await cardsModel.get(dbTransaction.cardId);
    expect(dbCard.id).toBe(dbTransaction.cardId);
    expect(dbCard.cardNumber).toBe(securify('4058700000000008'));
    expect(dbCard.balance).toBe(700);
  });
  
  test('get card by id, get transactions by card', async () => {
    const id = 1;
    const dbCard = await cardsModel.get(id);
    expect(dbCard.id).toBe(id);
    expect(dbCard.cardNumber).toBe(securify('4058700000000008'));
    expect(dbCard.balance).toBe(700);
    const dbTransactions = await transactionsModel.getBy('cardId', dbCard.id);
    const dbIds = dbTransactions.map(dbTransaction => dbTransaction.id).sort();
    expect(dbTransactions).toHaveLength(2);
    expect(dbIds).toEqual([1, 2]);
  });
  
  test('remove(id) is forbidden for transactions', () => {
    const err = new AppError(403, 'Forbidden: Transaction removing is forbidden');
    return expect(transactionsModel.remove()).rejects.toEqual(err);
  });
  
  test('update(object) is forbidden for transactions', () => {
    const err = new AppError(403, 'Forbidden: Transaction updating is forbidden');
    return expect(transactionsModel.update()).rejects.toEqual(err);
  });
  
});
