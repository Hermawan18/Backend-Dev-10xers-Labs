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

  const userAdmin = await User.findOne({ where: { role: 'admin' } });
  const userStaff = await User.findOne({ where: { role: 'staff' } });

  tokenAdmin = signToken({ id: userAdmin.id, name: userAdmin.name, role: userAdmin.role });
  tokenStaff = signToken({ id: userStaff.id, name: userStaff.name, role: userStaff.role });
});

afterAll(async () => {
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe('POST /login', () => {
  test('Success login', (done) => {
    request(app)
      .post('/users/login')
      .send({ name: 'user1', password: 'user1' })
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('access_token', expect.any(String));
        done();
      });
  });

  test('Failed login', (done) => {
    request(app)
      .post('/users/login')
      .send({ name: 'user1', password: 'salah' })
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', expect.any(String));
        expect(res.body.message).toContain('Please login first');
        done();
      });
  });

  test('Failed login because not input field', (done) => {
    request(app)
      .post('/users/login')
      .send({ name: '', password: '' })
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', expect.any(String));
        expect(res.body.message).toContain('Data Not Found');
        done();
      });
  });
});
