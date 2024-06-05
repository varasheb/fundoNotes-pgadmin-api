import {
  cacheAllNotes,
  invalidateNotesCache,
  getNoteFromCache
} from '../utils/note.util';

const { Note } = require('../models/association');

export const createNote = async (body) => {
  return await Note.create(body);
};

export const updateNote = async (noteId, userId, body) => {
  const updatedNote = await Note.update(body, {
    where: { id: noteId, createdBy: userId },
    returning: true
  });

  if (updatedNote[0] === 0) {
    throw new Error('NoteId is Invalid');
  }
  await cacheAllNotes(userId);
  return updatedNote[1][0];
};

export const getAllNotes = async (userId) => {
  await cacheAllNotes(userId);
  return await Note.findAll({
    where: { createdBy: userId }
  });
};

export const getNote = async (noteId, userId) => {
  await cacheAllNotes(userId);
  const note = await Note.findOne({
    where: { createdBy: userId, id: noteId }
  });
  if (!note) {
    throw new Error('User Id is Invalid');
  }
  return note;
};

export const deleteNote = async (noteId, userId) => {
  let note = await getNoteFromCache(noteId, userId);
  if (!note) {
    await cacheAllNotes(userId);
    note = await getNoteFromCache(noteId, userId);
  }
  if (note && note.trashed) {
    await invalidateNotesCache(userId);
    return await Note.destroy({
      where: { id: noteId }
    });
  } else {
    throw new Error('Note is not trashed');
  }
};

export const isArchivedNote = async (userId, noteId) => {
  let note = await getNoteFromCache(noteId, userId);
  if (!note) {
    await cacheAllNotes(userId);
    note = await getNoteFromCache(noteId, userId);
  }
  if (!note) {
    throw new Error('User Id is Invalid');
  }
  note.archived = !note.archived;
  const updatedNote = await Note.update(note, {
    where: { id: noteId, createdBy: userId },
    returning: true
  });

  if (updatedNote[0] === 0) {
    throw new Error('NoteId is Invalid');
  }
  await cacheAllNotes(userId);
  return updatedNote[1][0];
};

export const isTrashedNote = async (userId, noteId) => {
  let note = await getNoteFromCache(noteId, userId);
  if (!note) {
    await cacheAllNotes(userId);
    note = await getNoteFromCache(noteId, userId);
  }
  if (!note) {
    throw new Error('User Id is Invalid');
  }
  note = Note.build(note).dataValues;
  note.trashed = !note.trashed;
  const updatedNote = await Note.update(note, {
    where: { id: noteId, createdBy: userId },
    returning: true
  });

  if (updatedNote[0] === 0) {
    throw new Error('NoteId is Invalid');
  }
  await cacheAllNotes(userId);
  return note;
};
