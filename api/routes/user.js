import express from 'express';
import { activateAccount, activateAccountByCode, forgotPassword, loggedInUser, login, passwordResetAction, register } from '../controllers/userController.js';


const router = express.Router();

// route rest api
router.post('/login', login);
router.post('/register', register);
router.get('/me', loggedInUser);
router.get('/activate/:token', activateAccount);
router.post('/activation_code', activateAccountByCode)
router.post('/forgot-password', forgotPassword)
router.post('/forgot-password/:token', passwordResetAction)


export default router