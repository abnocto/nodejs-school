'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const app = require('../source/app');

chai.use(chaiHttp);

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
