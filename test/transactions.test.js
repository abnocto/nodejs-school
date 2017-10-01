process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();

const app = require('../source/app');
const TransactionsModel = require('../source/models/transactionsModel');

chai.use(chaiHttp);

describe('-- TRANSACTIONS --', () => {
  // reset
  before((done) => {
    const transactionsModel = new TransactionsModel();
    transactionsModel._dataSource = [];
    transactionsModel._writeFile()
      .then(() => { done(); });
  });
  
  // create
  describe('POST /cards/:id/transactions: doesn\'t have required fields', () => {
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
      { cardId: 1, type: 'prepaidCard', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { cardId: 1, data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { a: 'b', c: 2, data: '23423432434', time: '2017-08-9T05:28:31+03:00' },
    ];
    
    transactions.forEach((transaction, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .post('/cards/1/transactions')
          .send(transaction)
          .end((err, res) => {
            res.should.have.status(400);
            res.text.should.be.a('string');
            res.text.should.eql('Bad request: Transaction data doesn\'t have all required fields');
            done();
          });
      });
    });
  });
  
  describe('POST /cards/:id/transactions: forbidden type', () => {
    const transactions = [
      { cardId: 1, type: 'false', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { cardId: 'false', type: 'test', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
      { foo: 'bar', type: 'prepaidCard2Card', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 'false' },
    ];
    
    transactions.forEach((transaction, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .post('/cards/1/transactions')
          .send(transaction)
          .end((err, res) => {
            res.should.have.status(403);
            res.text.should.be.a('string');
            res.text.should.eql('Forbidden: Forbidden transaction type');
            done();
          });
      });
    });
  });
  
  describe('POST /cards/:id/transactions: bad sum', () => {
    const transactions = [
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: '2345' },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 'NaN' },
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
            res.text.should.eql('Bad request: Transaction sum is not a number');
            done();
          });
      });
    });
  });
  
  describe('POST /cards/:id/transactions: card not found by foreign key', () => {
    const transactions = [
      { type: 'prepaidCard', data: '220003000000003', sum: 1234 },
    ];
    
    transactions.forEach((transaction, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .post('/cards/123456789/transactions')
          .send(transaction)
          .end((err, res) => {
            res.should.have.status(404);
            res.text.should.be.a('string');
            res.text.should.eql('Not found: Card wasn\'t found by transaction card id');
            done();
          });
      });
    });
  });
  
  describe('POST /cards/:id/transactions: bad time', () => {
    const transactions = [
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: 'a', sum: 1234 },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: 'null', sum: 2345 },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: 'Object', sum: 3456 },
    ];
    
    transactions.forEach((transaction, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .post('/cards/1/transactions')
          .send(transaction)
          .end((err, res) => {
            res.should.have.status(400);
            res.text.should.be.a('string');
            res.text.should.eql('Bad request: Invalid transaction time');
            done();
          });
      });
    });
  });
  
  describe('POST /cards/:id/transactions: ok', () => {
    const transactions = [
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-09T05:28:31+03:00', sum: 2345 },
      { type: 'card2Card', data: '220003000000003', sum: 2345 },
    ];
    
    transactions.forEach((transaction, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .post(`/cards/${transaction.cardId || 1}/transactions`)
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
});
