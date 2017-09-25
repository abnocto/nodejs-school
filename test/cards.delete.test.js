'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../index');

chai.use(chaiHttp);

describe('DELETE /cards: invalid paths', () => {

	const paths = [
		'/a',
		'/b',
		'/abc',
	];

	paths.forEach((path, index) => {
		it(`test#${index + 1}`, (done) => {
			chai.request(app)
				.delete(`/cards${path}`)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});

});
