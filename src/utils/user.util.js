import redis from 'ioredis';

const { User } = require('../models/association');

const redisClient = redis.createClient({
  url: 'redis://localhost:6379'
});

export const populateCacheWithUser = async (email) => {
  const user = await User.findOne({ where: { email } });
  redisClient.set(`user:${user.email}`, JSON.stringify(user), 'EX', 36000);
};

export const getUserFromCache = async (email) => {
  return new Promise((resolve, reject) => {
    redisClient.get(`user:${email}`, (err, data) => {
      if (err) reject(err);
      resolve(data ? JSON.parse(data) : null);
    });
  });
};
