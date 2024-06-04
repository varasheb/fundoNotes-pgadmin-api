import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/index';
import redis from 'ioredis';
import sequelize, { DataTypes } from '../../src/config/database';
import * as UserService from '../../src/services/user.service';

const User = require('../../src/models/user.model')(sequelize, DataTypes);
const Note = require('../../src/models/note.model')(sequelize, DataTypes);
const redisClient = redis.createClient({
  url: 'redis://localhost:6379'
});

describe('Note APIs Test', () => {
  let token;
  let noteId;
  let userId;
  before(async () => {
    await User.destroy({ where: {} });
    await Note.destroy({ where: {} });
    await redisClient.flushdb();
  });
  after(async () => {
    await User.destroy({ where: {} });
    await Note.destroy({ where: {} });
    await redisClient.flushdb();
  });
  describe('User Operations for Testing Notes', () => {
    it('should create a new user in database for notes testing', async () => {
      const body = {
        firstName: 'test',
        lastName: 'man',
        email: 'testnote@gmail.com',
        password: 'Note@123'
      };
      const result = await UserService.signInUser(body);
      expect(result).to.be.an('object');
      expect(result.email).to.equal(body.email);
      userId = result.id;
    });

    it('should return user and token if email and password are correct', async () => {
      const result = await UserService.userLogin({
        email: 'testnote@gmail.com',
        password: 'Note@123'
      });

      expect(result).to.be.an('object');
      token = result.token;
    });
  });

  describe('Create Note (POST /api/v1/notes/)', () => {
    it('should create a new note', async () => {
      const newNote = {
        title: 'To do',
        description: 'to do testing of all apis'
      };
      const res = await request(app)
        .post('/api/v1/notes/')
        .send(newNote)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Note created successfully');
      noteId = res.body.data.id;
    });

    it('should throw error if user is not logged in', async () => {
      const newNote = {
        title: 'To do',
        description: 'to do testing of all apis'
      };
      const res = await request(app).post('/api/v1/notes/').send(newNote);
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Authentication required');
    });
  });

  describe('Get All Notes (GET /api/v1/notes/)', () => {
    it('should get all the notes for user', async () => {
      const res = await request(app)
        .get('/api/v1/notes/')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.data[0].id).to.equal(noteId);
      expect(res.body.data[0].createdBy).to.equal(userId);
    });

    it('should throw error if user is not logged in', async () => {
      const res = await request(app).get('/api/v1/notes/');
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Authentication required');
    });
  });

  describe('Get Note by ID (GET /api/v1/notes/:id)', () => {
    it('should get the note by id', async () => {
      const res = await request(app)
        .get(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.data.id).to.equal(noteId);
      expect(res.body.data.createdBy).to.equal(userId);
    });

    it('should throw error if user is not logged in', async () => {
      const res = await request(app).get(`/api/v1/notes/${noteId}`);
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Authentication required');
    });
  });

  describe('Update Note (PUT /api/v1/notes/:id)', () => {
    it('should update the existing notes', async () => {
      const updatedNote = {
        title: 'to update',
        description: 'to do testing of update api',
        color: 'orange'
      };
      const res = await request(app)
        .put(`/api/v1/notes/${noteId}`)
        .send(updatedNote)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.data.createdBy).to.equal(userId);
      expect(res.body.message).to.equal('Note Updated successfully');
    });

    it('should throw error if user is not logged in', async () => {
      const updatedNote = {
        title: 'to update',
        description: 'to do testing of update api',
        color: 'orange'
      };
      const res = await request(app)
        .put(`/api/v1/notes/${noteId}`)
        .send(updatedNote);
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Authentication required');
    });
  });

  describe('Trash Note (PUT /api/v1/notes/istrash/:id)', () => {
    it('should make the note trashed', async () => {
      const res = await request(app)
        .put(`/api/v1/notes/istrash/${noteId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Note Trashed successfully');
    });

    it('should throw error if user is not logged in', async () => {
      const res = await request(app).put(`/api/v1/notes/istrash/${noteId}`);
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Authentication required');
    });
  });

  describe('Archive Note (PUT /api/v1/notes/isarchive/:id)', () => {
    it('should make the note archived', async () => {
      const res = await request(app)
        .put(`/api/v1/notes/isarchive/${noteId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Note Archived successfully');
    });

    it('should throw error if user is not logged in', async () => {
      const res = await request(app).put(`/api/v1/notes/isarchive/${noteId}`);
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Authentication required');
    });
  });

  describe('Delete Note (DELETE /api/v1/notes/:id)', () => {
    it('should delete the existing note', async () => {
      const res = await request(app)
        .delete(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Deleted note successfully');
    });

    it('should throw error if user is not logged in', async () => {
      const res = await request(app).delete(`/api/v1/notes/${noteId}`);
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.equal('Authentication required');
    });
  });
});
