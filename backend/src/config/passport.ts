import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model';

export const configurePassport = () => {
  // JWT Strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret',
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.id);
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ 
            $or: [
              { googleId: profile.id },
              { email: profile.emails?.[0].value }
            ]
          });

          if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
              googleId: profile.id,
              email: profile.emails?.[0].value,
              name: profile.displayName,
              // Set a random password for Google OAuth users
              password: Math.random().toString(36).slice(-8),
            });
          } else if (!user.googleId) {
            // If user exists but doesn't have googleId (registered with email)
            user.googleId = profile.id;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}; 