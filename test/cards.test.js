process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();

const app = require('../source/app');
const CardsModel = require('../source/models/cardsModel');

chai.use(chaiHttp);

describe('-- CARDS --', () => {
  // reset
  before((done) => {
    const cardsModel = new CardsModel();
    cardsModel._dataSource = [];
    cardsModel._writeFile()
      .then(() => { done(); });
  });
  
  // create
  describe('POST /cards: invalid data', () => {
    const cards = [
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
      { cardNumber: '4111111111111111', balance: 12345 },
    ];
    
    cards.forEach((card, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .post('/cards')
          .send(card)
          .end((err, res) => {
            res.should.have.status(400);
            res.text.should.be.a('string');
            res.text.should.eql('Bad request: Card data is invalid');
            done();
          });
      });
    });
  });
  
  describe('POST /cards: invalid number', () => {
    const cards = [
      { cardNumber: '1234123412341234', balance: '12345' },
      { cardNumber: '1535153515351535', balance: '12345' },
      { cardNumber: '5678434234763470', balance: '1234' },
      { cardNumber: '0942341537482374', balance: '99999999' },
      { cardNumber: '5742387195357823', balance: '0' },
    ];
    
    cards.forEach((card, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .post('/cards')
          .send(card)
          .end((err, res) => {
            res.should.have.status(400);
            res.text.should.be.a('string');
            res.text.should.eql('Bad request: Card number is invalid');
            done();
          });
      });
    });
  });
  
  describe('POST /cards: OK', () => {
    const cards = [
      { cardNumber: '5469250000000004', balance: '231310' },
      { cardNumber: '6762300000000009', balance: '0' },
      { cardNumber: '4058700000000008', balance: '700' },
      { cardNumber: '5500640000000007', balance: '2' },
      { cardNumber: '4377840000000006', balance: '4545' },
      { cardNumber: '6768030000000006', balance: '120' },
    ];
    
    cards.forEach((card, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .post('/cards')
          .send(card)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('id').be.a('number');
            res.body.should.have.property('cardNumber').be.a('string');
            res.body.should.have.property('balance').be.a('string');
            done();
          });
      });
    });
  });
  
  describe('POST /cards: duplicate number', () => {
    const cards = [
      { cardNumber: '5469250000000004', balance: '12345' },
      { cardNumber: '6762300000000009', balance: '15000' },
      { cardNumber: '5500640000000007', balance: '-700' },
      { cardNumber: '6768030000000006', balance: '0' },
    ];
    
    cards.forEach((card, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .post('/cards')
          .send(card)
          .end((err, res) => {
            res.should.have.status(400);
            res.text.should.be.a('string');
            res.text.should.eql('Bad request: Duplicate card number');
            done();
          });
      });
    });
  });

  // remove
  describe('DELETE /cards: invalid paths', () => {
    const paths = [
      '/a',
      '/b',
      '/abc',
      '/-10',
    ];
    
    paths.forEach((path, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .delete(`/cards${path}`)
          .end((err, res) => {
            res.should.have.status(400);
            res.text.should.be.a('string');
            res.text.should.eql('Bad request: Id must be a positive integer');
            done();
          });
      });
    });
  });
  
  describe('DELETE /cards: can\'t find by id', () => {
    const paths = [
      '/1000000',
      '/99999999',
    ];
    
    paths.forEach((path, index) => {
      it(`test#${index + 1}`, (done) => {
        chai.request(app)
          .delete(`/cards${path}`)
          .end((err, res) => {
            res.should.have.status(404);
            res.text.should.be.a('string');
            res.text.should.eql(`Not found: Wasn't found by id ${Number(path.slice(1))}`);
            done();
          });
      });
    });
  });
  
  // get
  describe('GET /cards', () => {
    it('test#1', (done) => {
      chai.request(app)
        .get('/cards')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });
});
