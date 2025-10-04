import express from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';
import protectRoute from '../middlewares/auth.middleware.js';


const userRouter = express.Router();

userRouter.get('/current', protectRoute, getCurrentUser);
export default userRouter;