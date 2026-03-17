import { UserController } from '../controllers/user.controller.js';
import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';

const UserRouter = express.Router();

// Public routes
UserRouter.post('/register', UserController.register);
UserRouter.post('/login', UserController.login);
UserRouter.post('/logout', UserController.logout);

// Protected routes
UserRouter.get('/me', authenticateToken, UserController.getMe);
UserRouter.put('/update', authenticateToken, UserController.updateUser);
UserRouter.delete('/delete', authenticateToken, UserController.deleteUser);

// Public routes for password reset
UserRouter.post('/forgot-password', UserController.forgotPassword);
UserRouter.post('/reset-password', UserController.resetPassword);

export default UserRouter;


