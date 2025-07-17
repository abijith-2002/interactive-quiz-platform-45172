const User = require('../models/user.model');
const ResponseUtil = require('../utils/response.util');

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const { email, username } = req.body;

      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return ResponseUtil.validationError(res, {
          email: 'Email already exists'
        });
      }

      // Check if username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return ResponseUtil.validationError(res, {
          username: 'Username already exists'
        });
      }

      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();

      return ResponseUtil.success(
        res,
        201,
        'User registered successfully',
        { user, token }
      );
    } catch (error) {
      if (error.name === 'ValidationError') {
        return ResponseUtil.validationError(res, error.errors);
      }
      return ResponseUtil.error(res, 500, error.message);
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        return ResponseUtil.validationError(res, {
          message: 'Email and password are required'
        });
      }

      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken();

      return ResponseUtil.success(
        res,
        200,
        'Login successful',
        { user, token }
      );
    } catch (error) {
      return ResponseUtil.unauthorized(res, 'Invalid login credentials');
    }
  }

  // Logout user
  async logout(req, res) {
    try {
      req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
      await req.user.save();
      return ResponseUtil.success(res, 200, 'Logged out successfully');
    } catch (error) {
      return ResponseUtil.error(res, 500, error.message);
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      return ResponseUtil.success(
        res,
        200,
        'Profile retrieved successfully',
        { user: req.user }
      );
    } catch (error) {
      return ResponseUtil.error(res, 500, error.message);
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return ResponseUtil.validationError(res, {
        message: 'Invalid updates'
      });
    }

    try {
      updates.forEach(update => req.user[update] = req.body[update]);
      await req.user.save();
      return ResponseUtil.success(
        res,
        200,
        'Profile updated successfully',
        { user: req.user }
      );
    } catch (error) {
      if (error.name === 'ValidationError') {
        return ResponseUtil.validationError(res, error.errors);
      }
      return ResponseUtil.error(res, 500, error.message);
    }
  }
}

module.exports = new AuthController();
