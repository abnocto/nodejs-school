const log4js = require('log4js');

// create stubs for logger
const loggerMethods = ['info', 'warn', 'error'];
log4js.getLogger = jest.fn(() => loggerMethods.reduce((obj, key) => Object.assign(obj, { [key]: jest.fn() }), {}));

const db = require('../../../source/data');
const CardsModel = require('../../../source/models/cardsModel');
const TransactionsModel = require('../../../source/models/transactionsModel');
const Card = require('../../../source/data/domain/card');
const Transaction = require('../../../source/data/domain/transaction');
const AppError = require('../../../libs/appError');

const cardsModel = new CardsModel();
const transactionsModel = new TransactionsModel();

describe('Mongoose Model / Transactions Model', () => {

  beforeAll(() => db.connect());

  beforeEach(async () => {
    await Card.create({
      _id: '578df3efb618f5141202a194',
      cardNumber: '4058700000000008',
      balance: 700,
    });
    await Transaction.create({
      _id: '578df3efb618f5141202a195',
      cardId: '578df3efb618f5141202a194',
      type: 'prepaidCard',
      data: '220003000000003',
      time: '2017-10-04T05:28:31+03:00',
      sum: 2345,
    });
    return Transaction.create({
      _id: '578df3efb618f5141202a196',
      cardId: '578df3efb618f5141202a194',
      type: 'card2Card',
      data: '220003000000012',
      time: '2017-10-04T05:28:31+03:00',
      sum: 34565,
    });
  });

  afterEach(async () => {
    // don't want to call %Model%.remove({})
    const cardIds = ['578df3efb618f5141202a194'];
    await Promise.all(cardIds.map(id => Card.findByIdAndRemove(id)));
    const transationIds = ['578df3efb618f5141202a195', '578df3efb618f5141202a196'];
    return Promise.all(transationIds.map(id => Transaction.findByIdAndRemove(id)));
  });

  afterAll(() => db.disconnect());

  test('getAll()', async () => {
    const dbTransactions = await transactionsModel.getAll();
    const dbIds = dbTransactions.map(dbTransaction => dbTransaction.id).sort();
    expect(dbTransactions).toHaveLength(2);
    expect(dbIds).toEqual(['578df3efb618f5141202a195', '578df3efb618f5141202a196']);
  });

  test('get transaction by id, get card by transaction', async () => {
    const id = '578df3efb618f5141202a195';
    const dbTransaction = await transactionsModel.get(id);
    expect(dbTransaction.id).toBe(id);
    expect(dbTransaction.type).toBe('prepaidCard');
    expect(dbTransaction.sum).toBe(2345);
    const dbCard = await cardsModel.get(dbTransaction.cardId);
    expect(dbCard.id).toBe(dbTransaction.cardId);
    expect(dbCard.cardNumber).toBe('4058700000000008');
    expect(dbCard.balance).toBe(700);
  });

  test('get card by id, get transactions by card', async () => {
    const id = '578df3efb618f5141202a194';
    const dbCard = await cardsModel.get(id);
    expect(dbCard.id).toBe(id);
    expect(dbCard.cardNumber).toBe('4058700000000008');
    expect(dbCard.balance).toBe(700);
    const dbTransactions = await transactionsModel.getBy('cardId', dbCard.id);
    const dbIds = dbTransactions.map(dbTransaction => dbTransaction.id).sort();
    expect(dbTransactions).toHaveLength(2);
    expect(dbIds).toEqual(['578df3efb618f5141202a195', '578df3efb618f5141202a196']);
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
