'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../index');

chai.use(chaiHttp);

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
