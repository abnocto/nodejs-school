'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const app = require('../source/app');
const CardsModel = require('../source/models/cards');

chai.use(chaiHttp);

new CardsModel().removeAll()
	.then(ok => {

		describe('POST /cards: invalid data', () => {

			const cards = [
				{},
				{cardNumber: '1'},
				{cardNumber: 1},
				{balance: '1'},
				{balance: 1},
				{cardNumber: '1', balance: '1'},
				{cardNumber: '1', balance: 'text'},
				{cardNumber: 'text', balance: 1},
				{cardNumber: '1', balance: 1},
				{cardNumber: '12345', balance: '12345'},
			];

			cards.forEach((card, index) => {
				it(`test#${index + 1}`, (done) => {
					const card = cards[index];
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
				{cardNumber: '1234123412341234', balance: '12345'},
				{cardNumber: '1535153515351535', balance: 12345},
				{cardNumber: '5678434234763470', balance: '1234'},
				{cardNumber: '0942341537482374', balance: '99999999'},
				{cardNumber: '5742387195357823', balance: '0'},
			];

			cards.forEach((card, index) => {
				it(`test#${index + 1}`, (done) => {
					const card = cards[index];
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
				{cardNumber: '4111111111111111', balance: '12345'},
				{cardNumber: '5106216010173049', balance: 15000},
				{cardNumber: '5106216010126757', balance: '700'},
				{cardNumber: '4561261212345467', balance: 0},
			];

			cards.forEach((card, index) => {
				it(`test#${index + 1}`, (done) => {
					const card = cards[index];
					chai.request(app)
						.post('/cards')
						.send(card)
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('id');
							res.body.should.have.property('cardNumber');
							res.body.should.have.property('balance');
							done();
						});
				});
			});

		});

		describe('POST /cards: duplicate number', () => {

			const cards = [
				{cardNumber: '4111111111111111', balance: '12345'},
				{cardNumber: '5106216010173049', balance: 15000},
				{cardNumber: '5106216010126757', balance: '700'},
				{cardNumber: '4561261212345467', balance: 0},
			];

			cards.forEach((card, index) => {
				it(`test#${index + 1}`, (done) => {
					const card = cards[index];
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

	});
