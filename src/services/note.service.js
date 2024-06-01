import sequelize, { DataTypes } from '../config/database';
const Note = require('../models/note.model')(sequelize, DataTypes);

export const createNote = async (body) => {
  return await Note.create(body);
};

export const updateNote = async (noteId, userId, body) => {
  const [, [updatedNote]] = await Note.update(body, {
    where: { createdBy: userId, id: noteId },
    returning: true
  });
  if (!updatedNote) {
    throw new Error('NoteId is Invalid');
  }
  return updatedNote;
};

export const getAllNotes = async (userId) => {
  return await Note.findAll({
    where: { createdBy: userId }
  });
};

export const getNote = async (noteId, userId) => {
  const note = await Note.findOne({
    where: { createdBy: userId, id: noteId }
  });
  if (!note) {
    throw new Error('User Id is Invalid');
  }
  return note;
};

export const deleteNote = async (noteId, userId) => {
  const note = await Note.findOne({
    where: { createdBy: userId, id: noteId }
  });
  if (note && note.trashed) {
    return await Note.destroy({
      where: { id: noteId }
    });
  } else {
    throw new Error('Note is not trashed');
  }
};

export const isArchivedNote = async (userId, noteId) => {
  const note = await Note.findOne({
    where: { createdBy: userId, id: noteId }
  });
  if (!note) {
    throw new Error('User Id is Invalid');
  }
  note.archived = !note.archived;
  await note.save();
  return note;
};

export const isTrashedNote = async (userId, noteId) => {
  const note = await Note.findOne({
    where: { createdBy: userId, id: noteId }
  });
  if (!note) {
    throw new Error('User Id is Invalid');
  }
  note.trashed = !note.trashed;
  await note.save();
  return note;
};
