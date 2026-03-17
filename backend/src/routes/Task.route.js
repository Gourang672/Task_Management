import { TaskController } from '../controllers/task.controller.js';
import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';

const TaskRouter = express.Router();

// All task routes require authentication
TaskRouter.use(authenticateToken);

// Task CRUD routes
TaskRouter.post('/', TaskController.createTask);
TaskRouter.get('/', TaskController.getTasks);
TaskRouter.get('/:id', TaskController.getTask);
TaskRouter.put('/:id', TaskController.updateTask);
TaskRouter.delete('/:id', TaskController.deleteTask);

export default TaskRouter;