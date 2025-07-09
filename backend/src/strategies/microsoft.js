import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { handleOAuthCallback } from '../services/oauthService.js';
import dotenv from 'dotenv';

dotenv.config();

export default function(passport) {
  passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/microsoft/callback`,
    scope: ['user.read'],
    tenant: 'common',
  }, async (accessToken, refreshToken, profile, done) => {
      try {
        const result = await handleOAuthCallback({
                provider: 'microsoft',
                provider_id: profile.id,
                email: profile.emails?.[0]?.value || '',
                displayName: profile.displayName || 'Usuário Microsoft'
              });
        done(null, result);
    } catch (err) {
      done(err, null);
    }
  }));
} 
