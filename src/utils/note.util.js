import redis from 'ioredis';
import sequelize, { DataTypes } from '../config/database';


const Note = require('../models/note.model')(sequelize, DataTypes);
const redisClient = redis.createClient({
  url: 'redis://localhost:6379' 
});

export const getCacheKey =( userId) => `notes:${userId}`;

export const cacheAllNotes = async (userId) => {
  console.log('----------------------------------------');
  const notes = await Note.findAll({ where: { createdBy: userId } });
  const cacheKey = getCacheKey(userId);
  await redisClient.set(cacheKey, JSON.stringify(notes), 'EX', 3600); // Cache expires in 1 hour
}

export const getAllCachedNotes = async (userId)=>{
  return new Promise((resolve,reject)=>{
  const cacheKey =getCacheKey(userId);
  redisClient.get(cacheKey,(err,data)=>{
  if(err) reject(err);
  resolve(data ? JSON.parse(data):null);
  });
  });
}

export const getCachedNote = async (noteId, userId) => {
  const notes = await getAllCachedNotes(userId);
  return notes ? notes.find(note => note.id === parseInt(noteId)) : null;
}

export const invalidateNotesCache = async (userId) => {
  const cacheKey = getCacheKey(userId);
  await redisClient.del(cacheKey);
}
