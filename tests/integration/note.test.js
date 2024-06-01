import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/index';
import sequelize, { DataTypes } from '../../src/config/database';
import * as UserService from '../../src/services/user.service';

const Note = require('../../src/models/note.model')(sequelize, DataTypes);

describe('Note APIs Test', () => {
  let token;
  it('should return user object', async () => {
    const body = {
      firstName: 'test',
      lastName: 'man',
      email: 'testnote@gmail.com',
      password: 'Note@123'
    };
    const result = await UserService.signInUser(body);
    expect(result).to.be.an('object');
  });

  it('should return user and token if email and password are correct', async () => {
    const result = await UserService.userLogin({
      email: 'testnote@gmail.com',
      password: 'Note@123'
    });

    expect(result).to.be.an('object');
    token = result.token;
  });

  describe('GET /api/v1/notes/', () => {
    it('should log in the user', (done) => {
      request(app)
        .get('/api/v1/notes/')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });
});
