import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/index';
import sequelize, { DataTypes } from '../../src/config/database';


describe('User APIs Test', () => {
    let userId;
    let token;

  describe('POST /api/v1/users', () => {
    it('should register a new user', (done) => {
      const newUser = {
        firstName: 'testname',
        lastName: 'testlastname',
        email: 'testmail@gmail.com',
        password: 'Password@123'
      };

      request(app)
        .post('/api/v1/users')
        .send(newUser)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.include.keys('id', 'firstName', 'lastName', 'email');
          userId = res.body.data.id;
          done();
        });
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should log in the user', (done) => {
      const userCredentials = {
        email: 'testmail@gmail.com',
        password: 'Password@123'
      };

      request(app)
        .post('/api/v1/users/login')
        .send(userCredentials)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.data).to.be.an('object');
          expect(res.body).to.include.keys('token');
          token = res.body.token;
          done();
        });
    });
  });

});
