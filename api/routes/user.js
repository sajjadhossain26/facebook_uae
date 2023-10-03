import express from 'express';
import { activateAccount, activateAccountByCode, loggedInUser, login, register } from '../controllers/userController.js';


const router = express.Router();

// route rest api
router.post('/login', login);
router.post('/register', register);
router.get('/me', loggedInUser);
router.get('/activate/:token', activateAccount);
router.post('/activation_code', activateAccountByCode)


export default router