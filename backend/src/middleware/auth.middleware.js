import { verifyToken } from '../utils/jwt.js';
import { UserModel } from '../models/Users.model.js';

export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid. User not found.'
      });
    }

    // Add user info to request object
    req.user = decoded;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token is not valid.'
    });
  }
};