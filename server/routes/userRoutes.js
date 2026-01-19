import express from 'express';
import { getUserById, getUserResumes, loginUser, registerUser, resendVerification, verifyEmail } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/signup',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/data',protect,getUserById);
userRouter.get('/resumes',protect,getUserResumes);
userRouter.post('/verify-email',verifyEmail);
userRouter.post('/resend-verification',resendVerification);

export default userRouter;