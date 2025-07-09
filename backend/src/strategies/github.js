import { Strategy as GitHubStrategy } from 'passport-github2';
import { handleOAuthCallback } from '../services/oauthService.js';
import dotenv from 'dotenv';

dotenv.config();

export default function (passport) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
    scope: ['user:email'],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const result = await handleOAuthCallback({
        provider: 'github',
        provider_id: profile.id,
        email: profile.emails?.[0]?.value || '',
        displayName: profile.username,
      });
      done(null, result);
    } catch (err) {
      done(err, null);
    }
  }));
}
