import { TaskModel } from '../models/Tasks.module.js';
import { ConflictError, NotFoundError } from '../utils/errors.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { createTaskSchema, updateTaskSchema, taskIdSchema, getTasksSchema } from '../validations/user.validation.js';

export class TaskController {
  // Create a new task
  static async createTask(req, res, next) {
    try {
      const validatedData = createTaskSchema.parse({ body: req.body });
      const { title, description, status = 'pending' } = validatedData.body;

      const task = new TaskModel({
        title,
        description,
        status,
        user: req.user.userId
      });

      await task.save();

      sendCreated(res, 'Task created successfully', {
        task: {
          id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          createdAt: task.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTasks(req, res, next) {
    try {
      const validatedQuery = getTasksSchema.parse({ query: req.query });
      const { page, limit, status, sortBy, sortOrder } = validatedQuery.query;

      const filter = { user: req.user.userId };
      if (status) {
        filter.status = status;
      }

      const skip = (page - 1) * limit;
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const totalTasks = await TaskModel.countDocuments(filter);
      const totalPages = Math.ceil(totalTasks / limit);

      const totalAllTasks = await TaskModel.countDocuments({ user: req.user.userId });
      const totalCompletedTasks = await TaskModel.countDocuments({
        user: req.user.userId,
        status: 'completed'
      });
      const totalPendingTasks = await TaskModel.countDocuments({
        user: req.user.userId,
        status: 'pending'
      });

      const tasks = await TaskModel.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const formattedTasks = tasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }));

      const statistics = {
        totalAllTasks,
        totalCompletedTasks,
        totalPendingTasks,
        completionRate: totalAllTasks > 0 ? Math.round((totalCompletedTasks / totalAllTasks) * 100) : 0
      };

      const pagination = {
        currentPage: page,
        totalPages,
        totalTasks,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      };

      sendSuccess(res, 'Tasks retrieved successfully', {
        tasks: formattedTasks,
        pagination,
        statistics
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTask(req, res, next) {
    try {
      const validatedData = taskIdSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const task = await TaskModel.findOne({ _id: id, user: req.user.userId });

      if (!task) {
        throw new NotFoundError('Task not found');
      }

      sendSuccess(res, 'Task retrieved successfully', {
        task: {
          id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req, res, next) {
    try {
      const validatedId = taskIdSchema.parse({ params: req.params });
      const validatedData = updateTaskSchema.parse({ body: req.body });

      const { id } = validatedId.params;
      const updateData = validatedData.body;

      const task = await TaskModel.findOneAndUpdate(
        { _id: id, user: req.user.userId },
        updateData,
        { returnDocument: 'after', runValidators: true }
      );

      if (!task) {
        throw new NotFoundError('Task not found');
      }

      sendSuccess(res, 'Task updated successfully', {
        task: {
          id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req, res, next) {
    try {
      const validatedData = taskIdSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const task = await TaskModel.findOneAndDelete({ _id: id, user: req.user.userId });

      if (!task) {
        throw new NotFoundError('Task not found');
      }

      sendSuccess(res, 'Task deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}