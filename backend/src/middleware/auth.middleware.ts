import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticateJWT = passport.authenticate('jwt', { session: false });

export const authenticateGoogle = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

export const authenticateGoogleCallback = passport.authenticate('google', {
  session: false,
  failureRedirect: '/login',
});

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}; 