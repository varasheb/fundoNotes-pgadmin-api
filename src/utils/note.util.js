import redis from 'ioredis';
import HttpStatus from 'http-status-codes';

const { Note } = require('../models/association');
const redisClient = redis.createClient({
  url: 'redis://localhost:6379'
});

export const getCacheKey = (userId) => `notes:${userId}`;

export const cacheAllNotes = async (userId) => {
  const notes = await Note.findAll({ where: { createdBy: userId } });
  const cacheKey = getCacheKey(userId);
  await redisClient.set(cacheKey, JSON.stringify(notes), 'EX', 3600);
};

export const getAllCachedNotes = async (req, res, next) => {
  const userId = req.body.userId;
  return new Promise((resolve, reject) => {
    const cacheKey = getCacheKey(userId);
    redisClient.get(cacheKey, (err, data) => {
      if (data === null) {
        next();
        return;
      }
      if (err) reject(err);
      resolve(data ? JSON.parse(data) : null);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: JSON.parse(data),
        message: 'fetched notes sucefully'
      });
    });
  });
};

export const getCachedNote = async (req, res, next) => {
  const userId = req.body.userId;
  const noteId = req.params._id;
  const notes = await getNoteFromCache(userId);
  if (notes === null) {
    next();
    return;
  }
  notes ? notes.find((note) => note.id === parseInt(noteId)) : null;
  res.status(HttpStatus.OK).json({
    code: HttpStatus.OK,
    data: notes,
    message: 'fetched note sucefully'
  });
};

export const invalidateNotesCache = async (userId) => {
  const cacheKey = getCacheKey(userId);
  await redisClient.del(cacheKey);
};

export const getNoteFromCache = async (noteId, userId) => {
  const notes = await getAllFromCache(userId);
  return notes ? notes.find((note) => note.id === parseInt(noteId)) : null;
};

export const getAllFromCache = async (userId) => {
  return new Promise((resolve, reject) => {
    const cacheKey = getCacheKey(userId);
    redisClient.get(cacheKey, (err, data) => {
      if (err) reject(err);
      resolve(data ? JSON.parse(data) : null);
    });
  });
};
