process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const shourd = chai.should();

const app = require('../source/app');
const TransactionsModel = require('../source/models/transactionsModel');

chai.use(chaiHttp);

(async () => {
  // get
  describe('GET /cards/:id/transactions: ok', () => {
    const ids = [
      10000000,
      20000000,
      30000000,
      1,
      2,
      3,
    ];

    ids.forEach((id, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .get(`/cards/${id}/transactions`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          });
      });
    });
  });

  // reset
  const transactionsModel = new TransactionsModel();
  transactionsModel._dataSource = [];
  await transactionsModel._writeFile();

  // create
  describe('POST /cards/:id/transactions: invalid data', () => {
    const transactions = [
      {},
      { cardId: '1' },
      { type: 'prepaidCard' },
      { data: '12345' },
      { time: '0' },
      { sum: 123 },
      { cardId: 1, type: 'prepaidCard' },
      { data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00' },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', sum: 2345 },
      { cardId: 1, type: 'prepaidCard', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { cardId: 1, data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { cardId: 1, type: 'false', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { cardId: 'false', type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 'false' },
    ];

    transactions.forEach((transaction, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .post('/cards/1/transactions')
          .send(transaction)
          .end((err, res) => {
            res.should.have.status(400);
            res.text.should.be.a('string');
            res.text.should.eql('Bad request: Transaction data is invalid');
            done();
          });
      });
    });
  });

  describe('POST /cards/:id/transactions: OK', () => {
    const transactions = [
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { cardId: 1, type: 'card2Card', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
    ];

    transactions.forEach((transaction, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .post(`/cards/${transaction.cardId}/transactions`)
          .send(transaction)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('cardId');
            res.body.should.have.property('type');
            res.body.should.have.property('data');
            res.body.should.have.property('time');
            res.body.should.have.property('sum');
            done();
          });
      });
    });
  });
})();
