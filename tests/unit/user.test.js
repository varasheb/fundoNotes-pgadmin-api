import { expect } from 'chai';
import * as UserService from '../../src/services/user.service';

describe('User Service Function Test', () => {
  
  describe('signInUser Function Tests', () => {
    it('signInUser() should return user object', async () => {
      const body = {
        firstName: 'Rohit',
        lastName: 'Shrma',
        email: 'rohit@gmail.com',
        password: 'Rohit@123'
      };

      const result = await UserService.signInUser(body);
      expect(result).to.be.an('object');
      expect(result.email).to.equals(body.email);
    });

    it('signInUser() should throw an error if email already exists', async () => {
      try {
        await UserService.signInUser({
          firstName: 'Rohit',
          lastName: 'Shrma',
          email: 'rohit@gmail.com',
          password: 'Rohit@123'
        });
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err.message).to.equal('User with this email already exists');
      }
    });
  });

  describe('userLogin Function Tests', () => {
    it('userLogin() should return user and token if email and password are correct', async () => {
      const body = {
        email: 'rohit@gmail.com',
        password: 'Rohit@123'
      };
      const result = await UserService.userLogin(body);
      expect(result).to.be.an('object');
      expect(result.user.email).to.deep.equal(body.email);
    });

    it('userLogin() should throw an error if email or password are incorrect', async () => {
      try {
        await UserService.userLogin({
          email: 'rohit@gmail.com',
          password: 'password'
        });
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err.message).to.equal('Invalid email or password');
      }
    });
  });
});
