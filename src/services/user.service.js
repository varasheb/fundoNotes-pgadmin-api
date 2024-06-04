import sequelize, { DataTypes } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendmail from '../utils/sendEmail';
import {populateCacheWithUser,getUserFromCache} from '../utils/user.util'

const User = require('../models/user.model')(sequelize, DataTypes);

dotenv.config();  
const key = process.env.JWT_SECRET_KEY;
const resetkey = process.env.SECRET_KEY;


export const signInUser = async (body) => {
  const userExists = await User.findOne({ where: { email: body.email } });
  if (userExists) {
    throw new Error('User with this email already exists');
  } else {
    body.password = await bcrypt.hash(body.password, 10);
    const data = await User.create(body);

    // Store the user data in Redis cache
    await populateCacheWithUser(data.email);
    return data;
  }
};

export const userLogin = async ({ email, password }) => {
    let cachedUser = await getUserFromCache(email);
    if (!cachedUser) {
        await populateCacheWithUser(email);
        cachedUser = await getUserFromCache(email);
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
        await populateCacheWithUser(email);
        cachedUser = await getUserFromCache(email);
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
  await populateCacheWithUser(user.email);
  return user;
};
