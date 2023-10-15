import express from 'express';
import { activateAccount, activateAccountByCode, findAccount, forgotPassword, loggedInUser, login, passwordResetAction, register, resendActivation } from '../controllers/userController.js';


const router = express.Router();

// route rest api
router.post('/login', login);
router.post('/register', register);
router.get('/me', loggedInUser);
router.get('/activate/:token', activateAccount);
router.post('/activation_code', activateAccountByCode)
router.post('/resend_activate', resendActivation)
router.post('/forgot-password', forgotPassword)
router.post('/forgot-password/:token', passwordResetAction)
router.post('/find-account', findAccount)


export default router