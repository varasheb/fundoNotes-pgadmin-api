import express from 'express';
import * as userController from '../controllers/user.controller';
import {
  signInUserValidator,
  loginValidator,
  emailValidator,
  passwordValidator
} from '../validators/user.validator';
import { userResetAuth } from '../middlewares/auth.middleware';

const router = express.Router();

//route to Register a new user
router.post('', signInUserValidator, userController.signInUser);

router.post('/login', loginValidator, userController.userLogin);

router.post('/forgotpassword', emailValidator, userController.forgetPassword);

router.post(
  '/resetPassword',
  userResetAuth,
  passwordValidator,
  userController.resetPassword
);

export default router;
