process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

jest.mock('../../source/services/cardsService');
jest.mock('../../source/services/transactionsService');

const log4js = require('log4js');

log4js.getLogger = jest.fn(() =>
  ({
    info: () => {},
    error: () => {},
  }),
);

console.error = jest.fn(); // eslint-disable-line no-console

const { HTTP_SERVER: http, HTTPS_SERVER: https } = require('../../source/app');
const request = require('supertest');

describe('Controller', () => {
  
  afterEach(() => {
    http.close();
    https.close();
  });
  
  test('GET /cards', async () => {
    const res = await request(https).get('/cards');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(3);
  });
  
  test('POST /cards', async () => {
    const data = {};
    const res = await request(https).post('/cards').send(data);
    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body).toEqual(data);
  });
  
  test('DELETE /cards/:id', async () => {
    const id = 1;
    const res = await request(https).delete(`/cards/${id}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('text/plain');
    expect(res.body).toEqual({});
  });
  
  test('POST /cards/:id/pay', async () => {
    const id = 1;
    const data = {};
    const res = await request(https).post(`/cards/${id}/pay`).send(data);
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
    const res = await request(https).post(`/cards/${id}/fill`).send(data);
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
    const res = await request(https).post(`/cards/${id}/transfer`).send(data);
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
    const res = await request(https).get(`/cards/${id}/transactions`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(1);
  });
  
  test('POST /cards/:id/transactions', async () => {
    const id = 1;
    const data = {};
    const res = await request(https).post(`/cards/${id}/transactions`).send(data);
    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body).toEqual(data);
  });
  
  test('GET /error', async () => {
    try {
      const res = await request(https).get('/error');
    } catch (err) {
      expect(err).toMatch('Oops!');
    }
  });
  
  test('GET /random', async () => {
    const res = await request(https).get('/random');
    expect(res.status).toEqual(404);
    expect(res.type).toEqual('text/plain');
    expect(res.body).toEqual({});
  });
  
});
