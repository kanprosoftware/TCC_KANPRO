import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2-raviga';
import { handleOAuthCallback } from '../services/oauthService.js';
import dotenv from 'dotenv';

dotenv.config();

export default function(passport) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/linkedin/callback`,
    scope: ['email', 'profile', 'openid'],
    state: true,
    authorizationParams: {
        access_type: 'offline'
      }
  }, async (accessToken, refreshToken, profile, done) => {
    // console.log("profile", profile);
      try {
        const result = await handleOAuthCallback({
                provider:'linkedin',
                provider_id: profile.id,
                email: profile.email || '',
                displayName: profile.displayName || 'Usuário Linkedin'
              });
      done(null, result);
    } catch (err) {
      done(err, null);
    }
  }));
}
