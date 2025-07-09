import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { handleOAuthCallback } from '../services/oauthService.js';
import dotenv from 'dotenv';

dotenv.config();

export default function (passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const result = await handleOAuthCallback({
        provider: 'google',
        provider_id: profile.id,
        email: profile.emails?.[0]?.value || '',
        displayName: profile.displayName,
      });
      done(null, result);
    } catch (err) {
      done(err, null);
    }
  }));
}