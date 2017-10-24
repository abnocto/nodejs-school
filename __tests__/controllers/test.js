jest.mock('../../source/services/cardsService');
jest.mock('../../source/services/transactionsService');

const fs = require('fs');
const https = require('https');
const request = require('supertest');
const app = require('../../source/app');
const serverConfig = require('../../source/config/server');

const SSL_OPTIONS = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};

// https server only, without db connection
const server = https.createServer(SSL_OPTIONS, app.callback()).listen(serverConfig.HTTPS.port);

describe('Controller', () => {
  
  afterAll(() => server.close());
  
  test('GET /cards', async () => {
    const res = await request(server).get('/cards');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(3);
  });
  
  test('POST /cards', async () => {
    const data = {};
    const res = await request(server).post('/cards').send(data);
    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body).toEqual(data);
  });
  
  test('DELETE /cards/:id', async () => {
    const id = 1;
    const res = await request(server).delete(`/cards/${id}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('text/plain');
    expect(res.body).toEqual({});
  });
  
  test('POST /cards/:id/pay', async () => {
    const id = 1;
    const data = {};
    const res = await request(server).post(`/cards/${id}/pay`).send(data);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    const { cards, transactions } = res.body;
    expect(cards).toBeInstanceOf(Array);
    expect(cards).toHaveLength(1);
    expect(transactions).toBeInstanceOf(Array);
    expect(transactions).toHaveLength(1);
  });
  
  test('POST /cards/:id/fill', async () => {
    const id = 1;
    const data = {};
    const res = await request(server).post(`/cards/${id}/fill`).send(data);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    const { cards, transactions } = res.body;
    expect(cards).toBeInstanceOf(Array);
    expect(cards).toHaveLength(1);
    expect(transactions).toBeInstanceOf(Array);
    expect(transactions).toHaveLength(1);
  });
  
  test('POST /cards/:id/transfer', async () => {
    const id = 1;
    const data = {};
    const res = await request(server).post(`/cards/${id}/transfer`).send(data);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    const { cards, transactions } = res.body;
    expect(cards).toBeInstanceOf(Array);
    expect(cards).toHaveLength(2);
    expect(transactions).toBeInstanceOf(Array);
    expect(transactions).toHaveLength(2);
  });
  
  test('GET /cards/:id/transactions', async () => {
    const id = 1;
    const res = await request(server).get(`/cards/${id}/transactions`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(1);
  });
  
  test('POST /cards/:id/transactions', async () => {
    const id = 1;
    const data = {};
    const res = await request(server).post(`/cards/${id}/transactions`).send(data);
    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body).toEqual(data);
  });
  
  test('GET /error', async () => {
    try {
      const res = await request(server).get('/error');
    } catch (err) {
      expect(err).toMatch('Oops!');
    }
  });
  
  test('GET /random', async () => {
    const res = await request(server).get('/random');
    expect(res.status).toEqual(404);
    expect(res.type).toEqual('text/plain');
    expect(res.body).toEqual({});
  });
  
});
