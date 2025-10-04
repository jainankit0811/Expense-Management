import express from 'express';
import { googleAuth, login, resetPassword, sendOtpMail, signOut, signUp, verifyOTP } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.get('/signout', signOut);
authRouter.post('/send-otp', sendOtpMail);
authRouter.post('/verify-otp', verifyOTP);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/google-auth', googleAuth);


export default authRouter;