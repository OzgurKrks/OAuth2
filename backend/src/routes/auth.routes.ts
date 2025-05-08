import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import {
  authenticateJWT,
  authenticateGoogle,
  authenticateGoogleCallback,
} from '../middleware/auth.middleware';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const user = await User.create({
      email,
      password,
      name,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      {
        expiresIn: '1d',
      }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      {
        expiresIn: '1d',
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Google OAuth routes
router.get('/google', authenticateGoogle);

router.get(
  '/google/callback',
  authenticateGoogleCallback,
  async (req, res) => {
    try {
      const user = req.user as any;
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your_jwt_secret',
        {
          expiresIn: '1d',
        }
      );

      // Redirect to frontend with token
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify({
          id: user._id,
          email: user.email,
          name: user.name,
        })
      )}`;

      res.redirect(redirectUrl);
    } catch (error) {
      const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?error=${encodeURIComponent(
        'Authentication failed'
      )}`;
      res.redirect(errorUrl);
    }
  }
);

// Get current user
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById((req.user as any)._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        googleId: user.googleId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router; 