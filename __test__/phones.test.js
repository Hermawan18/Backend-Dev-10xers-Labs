const app = require('../app');
const request = require('supertest');
const { sequelize, User } = require('../models');
const { queryInterface } = sequelize;
const { signToken } = require('../helpers/jwt');
const { hashPassword } = require('../helpers/bcrypt');

let tokenAdmin, tokenStaff;
let tokenInvalid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzA2Njc0NjE3fQ.FODMm8HV5c4XvPYLzL7zBo4uXFzi0ySpBPFfp2ky4';

beforeAll(async () => {
  const users = require('../db_sample/users.json').map((user) => {
    delete user.id;
    user.createdAt = user.updatedAt = new Date();
    user.password = hashPassword(user.password);
    return user;
  });
  await queryInterface.bulkInsert('Users', users, {});

  const phones = require('../db_sample/phones.json').map((phone) => {
    delete phone.id;
    phone.createdAt = phone.updatedAt = new Date();
    return phone;
  });
  await queryInterface.bulkInsert('Phones', phones, {});

  const userAdmin = await User.findOne({ where: { role: 'admin' } });
  const userStaff = await User.findOne({ where: { role: 'staff' } });
  console.log(userAdmin.name, 'ini user admin');

  tokenAdmin = signToken({ id: userAdmin.id, name: userAdmin.name, role: userAdmin.role });
  tokenStaff = signToken({ id: userStaff.id, name: userStaff.name, role: userStaff.role });
});

afterAll(async () => {
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await queryInterface.bulkDelete('Phones', null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe('GET /phones', () => {
  test('Success get all phones', (done) => {
    request(app)
      .get('/phones')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body[0]).toHaveProperty('id', expect.any(Number));
        expect(res.body[0]).toHaveProperty('brand', expect.any(String));
        expect(res.body[0]).toHaveProperty('model', expect.any(String));
        expect(res.body[0]).toHaveProperty('colors', expect.any(String));
        expect(res.body[0]).toHaveProperty('price', expect.any(Number));
        expect(res.body[0]).toHaveProperty('stock', expect.any(Number));
        expect(res.body[0]).toHaveProperty('userId', expect.any(Number));
        done();
      });
  });

  test('Failed get all phones', (done) => {
    request(app)
      .get('/phones')
      .set('Authorization', `Bearer ${tokenStaff}`)
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('message', expect.any(String));
        expect(res.body.message).toContain('Forbidden Access');
        done();
      });
  });

  test('Failed get all phones because invalid token', (done) => {
    request(app)
      .get('/phones')
      .set('Authorization', `Bearer ${tokenInvalid}`)
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', expect.any(String));
        expect(res.body.message).toContain('Please login first');
        done();
      });
  });
});

describe('POST /phones', () => {
  test('Success create phone', (done) => {
    request(app)
      .post('/phones')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        brand: 'Poco',
        model: 'Poco F1',
        colors: 'Phantom Gray',
        price: 18000000,
        stock: 5,
      })
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id', expect.any(Number));
        expect(res.body).toHaveProperty('brand', expect.any(String));
        expect(res.body).toHaveProperty('model', expect.any(String));
        expect(res.body).toHaveProperty('colors', expect.any(String));
        expect(res.body).toHaveProperty('price', expect.any(Number));
        expect(res.body).toHaveProperty('stock', expect.any(Number));
        expect(res.body).toHaveProperty('userId', expect.any(Number));
        done();
      });
  });

  test('Failed create phone', (done) => {
    request(app)
      .post('/phones')
      .set('Authorization', `Bearer ${tokenStaff}`)
      .send({
        brand: 'Poco',
        model: 'Poco F1',
        colors: 'Phantom Gray',
        price: 18000000,
        stock: 5,
      })
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('message', expect.any(String));
        expect(res.body.message).toContain('Forbidden Access');
        done();
      });
  });

  test('Failed create phone because not input field', (done) => {
    request(app)
      .post('/phones')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        brand: '',
        model: '',
        colors: '',
        price: '',
        stock: '',
      })
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', expect.any(Array));
        done();
      });
  });
});

describe('PUT /phones/:id', () => {
  test('Success update phone', (done) => {
    request(app)
      .put('/phones/1')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        brand: 'Poco',
        model: 'Poco F1',
        colors: 'Phantom Gray',
        price: 18000000,
        stock: 5,
      })
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', expect.any(Number));
        expect(res.body[0]).toHaveProperty('brand', expect.any(String));
        expect(res.body[0]).toHaveProperty('model', expect.any(String));
        expect(res.body[0]).toHaveProperty('colors', expect.any(String));
        expect(res.body[0]).toHaveProperty('price', expect.any(Number));
        expect(res.body[0]).toHaveProperty('stock', expect.any(Number));
        done();
      });
  });

  test('Failed update phone', (done) => {
    request(app)
      .put('/phones/1')
      .set('Authorization', `Bearer ${tokenStaff}`)
      .send({
        brand: 'Poco',
        model: 'Poco F1',
        colors: 'Phantom Gray',
        price: 18000000,
        stock: 5,
      })
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('message', expect.any(String));
        expect(res.body.message).toContain('Forbidden Access');
        done();
      });
  });

  test('Failed update phone because not input field', (done) => {
    request(app)
      .put('/phones/1')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        brand: '',
        model: '',
        colors: '',
        price: '',
        stock: '',
      })
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', expect.any(Array));
        done();
      });
  });
});

describe('DELETE /phones/:id', () => {
  test('Success delete phone', (done) => {
    request(app)
      .delete('/phones/1')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', expect.any(String));
        done();
      });
  });

  test('Failed delete phone', (done) => {
    request(app)
      .delete('/phones/1')
      .set('Authorization', `Bearer ${tokenStaff}`)
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('message', expect.any(String));
        expect(res.body.message).toContain('Forbidden Access');
        done();
      });
  });
});
