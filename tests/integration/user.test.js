import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/index';
import sequelize, { DataTypes } from '../../src/config/database';

const User = require('../../src/models/user.model')(sequelize, DataTypes);

describe('User APIs Test', () => {
    let userId;
    let token;

    before(async () => {
        await User.destroy({ where: {} });
      });

  describe('POST /api/v1/users', () => {
    it('should register a new user', (done) => {
      const newUser = {
        firstName: 'testname',
        lastName: 'testlastname',
        email: 'varkanthi456.job@gmail.com',
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
        email: 'varkanthi456.job@gmail.com',
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

//   describe('POST /api/v1/users/forgotpassword', () => {
//     it('should send a password reset email', (done) => {
//       const email = {
//         email: 'varkanthi456.job@gmail.com'
//       };

//       request(app)
//         .post('/api/v1/users/forgotpassword')
//         .send(email)
//         .end((err, res) => {
//           expect(res.statusCode).to.equal(200);
//           expect(res.body.message).to.equal('Password reset email sent');
//           token = res.body.token;
//           done();
//         });
//     });
//   });

//   describe('POST /api/v1/users/resetPassword', () => {
//     it('should reset the user password', (done) => {
//       const resetPassword = {
//         newPassword: 'NewPassword@123'
//       };

//       request(app)
//         .post('/api/v1/users/resetPassword')
//         .send(resetPassword)
//         .set('Authorization', `Bearer ${token}`)
//         .end((err, res) => {
//           expect(res.statusCode).to.equal(200);
//           expect(res.body.message).to.equal('Password reset successful');
//           done();
//         });
//     });
//   });
});