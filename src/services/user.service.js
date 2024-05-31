import sequelize, { DataTypes } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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
    return data;
  }
};

export const userLogin = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user.id }, key, { expiresIn: '1h' });
  return { user, token };
};