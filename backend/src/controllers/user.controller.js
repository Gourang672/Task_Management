import { UserModel } from '../models/Users.model.js';
import { generateToken } from '../utils/jwt.js';
import { ConflictError, AuthenticationError, NotFoundError, ValidationError } from '../utils/errors.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { registerSchema, loginSchema, updateUserSchema, forgotPasswordSchema, resetPasswordSchema } from '../validations/user.validation.js';
import bcrypt from 'bcrypt';

export class UserController {
  static async register(req, res, next) {
    try {
      const validatedData = registerSchema.parse({ body: req.body });
      const { firstName, lastName, email, password } = validatedData.body;

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new UserModel({
        firstName,
        lastName,
        email,
        password: hashedPassword
      });

      await user.save();

      // Generate JWT token
      const token = generateToken(user._id);

      // Set cookie with JWT token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1 * 24 * 60 * 60 * 1000
      });

      sendCreated(res, 'User registered successfully', {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const validatedData = loginSchema.parse({ body: req.body });
      const { email, password } = validatedData.body;

      // Find user by email and include password for comparison
      const user = await UserModel.findOne({ email }).select('+password');
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Generate JWT token
      const token = generateToken(user._id);

      // Set cookie with JWT token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1 * 24 * 60 * 60 * 1000
      });

      sendSuccess(res, 'Login successful', {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      // Clear the JWT cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      sendSuccess(res, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.userId);

      if (!user) {
        throw new NotFoundError('User');
      }

      sendSuccess(res, 'User retrieved successfully', {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const validatedData = updateUserSchema.parse({ body: req.body });
      const { firstName, lastName, email } = validatedData.body;

      // Check if email is already taken by another user
      if (email) {
        const existingUser = await UserModel.findOne({ email, _id: { $ne: req.user.userId } });
        if (existingUser) {
          throw new ConflictError('Email is already taken');
        }
      }

      const user = await UserModel.findByIdAndUpdate(
        req.user.userId,
        { firstName, lastName, email },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new NotFoundError('User');
      }

      sendSuccess(res, 'User updated successfully', {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const user = await UserModel.findByIdAndDelete(req.user.userId);

      if (!user) {
        throw new NotFoundError('User');
      }

      // Clear the JWT cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      sendSuccess(res, 'User account deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const validatedData = forgotPasswordSchema.parse({ body: req.body });
      const { email } = validatedData.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new NotFoundError('No account found with this email address');
      }

      sendSuccess(res, 'Email verified successfully');
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const validatedData = resetPasswordSchema.parse({ body: req.body });
      const { email, newPassword } = validatedData.body;

      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      user.password = hashedPassword;
      await user.save();

      sendSuccess(res, 'Password reset successfully');
    } catch (error) {
      next(error);
    }
  }
}