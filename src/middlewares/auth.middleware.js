import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();
const key = process.env.JWT_SECRET_KEY;
const resetKey = process.env.SECRET_KEY;

export const userAuth = async (req, res, next) => {
  try {
    let bearerToken = req.headers.authorization;
    if (!bearerToken) {
      throw new Error('Authentication required');
    }
    bearerToken = bearerToken.split(' ')[1];
    const { userId } = await jwt.verify(bearerToken, key);
    res.locals.userId = userId;
    res.locals.token = bearerToken;
    next();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      code: HttpStatus.UNAUTHORIZED,
      message: error.message
    });
  }
};

export const userResetAuth = async (req, res, next) => {
  try {
    let bearerToken = req.headers.authorization;
    if (!bearerToken) {
      throw new Error('Authentication required');
    }
    bearerToken = bearerToken.split(' ')[1];
    const { userId } = await jwt.verify(bearerToken, resetKey);
    res.locals.userId = userId;
    res.locals.token = bearerToken;
    next();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      code: HttpStatus.UNAUTHORIZED,
      message: error.message
    });
  }
};
