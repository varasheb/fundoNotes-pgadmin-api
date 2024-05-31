import express from 'express';
import * as userController from '../controllers/user.controller';
import { signInUserValidator,loginValidator } from '../validators/user.validator';
import { userAuth, } from '../middlewares/auth.middleware';

const router = express.Router();

//route to Register a new user
router.post('', signInUserValidator, userController.signInUser);

router.post('/login',loginValidator, userController.userLogin);




export default router;
