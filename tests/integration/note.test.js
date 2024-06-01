import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/index';
import sequelize, { DataTypes } from '../../src/config/database';
import * as UserService from '../../src/services/user.service';

const User = require('../../src/models/user.model')(sequelize, DataTypes);
const Note = require('../../src/models/note.model')(sequelize, DataTypes);

describe('Note APIs Test', () => {
  let token;
  let noteId;

  before(async () => {
    await User.destroy({ where: {} });
    await Note.destroy({ where: {} });
  });

  it('should create a new user in database for notes testing', async () => {
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

  it('should get all the notes for user', async () => {
    const res = await request(app)
      .get('/api/v1/notes/')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.data[0].id).to.equal(noteId);
  });

  it('should get the note by id', async () => {
    const res = await request(app)
      .get(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.data.id).to.equal(noteId);
  });

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
    expect(res.body.message).to.equal('Note Updated successfully');
  });

  it('should make the note Trashed', async () => {
    const res = await request(app)
      .put(`/api/v1/notes/istrash/${noteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.equal('Note Trached successfully');
  });

  it('should make the note Archived', async () => {
    const res = await request(app)
      .put(`/api/v1/notes/isarchive/${noteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.equal('Note Archived successfully');
  });

  it('should delete the existing notes', async () => {
    const res = await request(app)
      .delete(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.equal('Deleted note sucefully');
  });
});
