import sequelize, { DataTypes } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendmail from '../utils/sendEmail';
import redis from 'ioredis';

const User = require('../models/user.model')(sequelize, DataTypes);

dotenv.config();  
const key = process.env.JWT_SECRET_KEY;
const resetkey = process.env.SECRET_KEY;

const redisClient = redis.createClient({
  url: 'redis://localhost:6379' 
});

const populateCacheWithAllUsers = async () => {
  const allUsers = await User.findAll();
  allUsers.forEach(user => {
    redisClient.set(`user:${user.email}`, JSON.stringify(user));
  });
};

const getUserFromCache = async (email) => {
  return new Promise((resolve, reject) => {
    redisClient.get(`user:${email}`, (err, data) => {
      if (err) reject(err);
      resolve(data ? JSON.parse(data) : null);
    });
  });
};

export const signInUser = async (body) => {
  let cachedUser = await getUserFromCache(body.email);
  if (cachedUser) {
    throw new Error('User with this email already exists');
  }
  const userExists = await User.findOne({ where: { email: body.email } });
  if (userExists) {
    throw new Error('User with this email already exists');
  } else {
    body.password = await bcrypt.hash(body.password, 10);
    const data = await User.create(body);

    // Store the user data in Redis cache
    await populateCacheWithAllUsers();
    return data;
  }
};

export const userLogin = async ({ email, password }) => {
    let cachedUser = await getUserFromCache(email);
    if (!cachedUser) {
      const isCacheEmpty = await redisClient.keys('user:*');
      if (isCacheEmpty.length === 0) {
        await populateCacheWithAllUsers();
        cachedUser = await getUserFromCache(email);
      }
    }

    const user = cachedUser || await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ userId: user.id }, key, { expiresIn: '1h' });
    return { user, token };
};

export const forgetPassword = async ({ email }) => {
  let cachedUser = await getUserFromCache(email);
    if (!cachedUser) {
      const isCacheEmpty = await redisClient.keys('user:*');
      if (isCacheEmpty.length === 0) {
        await populateCacheWithAllUsers();
        cachedUser = await getUserFromCache(email);
      }
    }

    const user = cachedUser || await User.findOne({ where: { email } });
  if (!user) throw new Error("This email does not exist");

  const token = jwt.sign({ userId: user.id }, resetkey, { expiresIn: '10m' });
  const result = await sendmail(user.email, token);
  return { user, token, result };
};

export const resetPassword = async (userId, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  await populateCacheWithAllUsers();
  return user;
};
