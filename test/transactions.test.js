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
      { cardId: 1, data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: '2345' },
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
      { foo: 'bar', type: 'prepaidCard2Card', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: 2345 },
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
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: '2500' },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: '1000abc' },
      { cardId: 1, type: 'prepaidCard', data: '220003000000003', time: '2017-08-9T05:28:31+03:00', sum: '0' },
    ];
    
    transactions.forEach((transaction, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .post('/cards/1/transactions')
          .send(transaction)
          .end((err, res) => {
            res.should.have.status(400);
            res.text.should.be.a('string');
            res.text.should.eql('Bad request: Transaction sum is invalid');
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
      { cardId: 4, type: 'prepaidCard', data: '220003000000003', time: '2017-10-04T13:28:31+03:00', sum: 2345 },
      { cardId: 4, type: 'paymentMobile', data: '+7(921)3333333', time: '2017-10-04T13:28:31+03:00', sum: -25 },
      { cardId: 4, type: 'card2Card', data: '220003000000005', time: '2017-10-04T13:28:31+03:00', sum: -174 },
      { cardId: 4, type: 'prepaidCard', data: '220003000000003', time: '2017-10-04T13:28:31+03:00', sum: 2345 },
      { cardId: 4, type: 'paymentMobile', data: '+7(921)3333333', time: '2017-10-04T13:28:31+03:00', sum: -25 },
      { cardId: 4, type: 'card2Card', data: '220003000000005', time: '2017-10-04T13:28:31+03:00', sum: -174 },
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
