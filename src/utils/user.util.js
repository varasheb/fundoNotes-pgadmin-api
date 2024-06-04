import redis from 'ioredis';
import sequelize, { DataTypes } from '../config/database';

const User = require('../models/user.model')(sequelize, DataTypes);

const redisClient = redis.createClient({
  url: 'redis://localhost:6379'
});

export const populateCacheWithUser = async (email) => {
  const user = await User.findOne({ where: { email } });
  redisClient.set(`user:${user.email}`, JSON.stringify(user));
};

export const getUserFromCache = async (email) => {
  return new Promise((resolve, reject) => {
    redisClient.get(`user:${email}`, (err, data) => {
      if (err) reject(err);
      resolve(data ? JSON.parse(data) : null);
    });
  });
};
