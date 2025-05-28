// src/strategies/linkedin.js
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function(passport) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/linkedin/callback`,
    scope: ['r_liteprofile', 'r_emailaddress'],
    state: true,
  }, async (accessToken, refreshToken, profile, done) => {
    const provider = 'linkedin';
    const providerId = profile.id;
    const email = profile.emails?.[0]?.value || '';
    const displayName = profile.displayName || 'Usuário LinkedIn';

    try {
      let login = await prisma.login.findFirst({ where: { provider, providerId } });

      if (!login) {
        login = await prisma.login.create({
          data: {
            provider,
            providerId,
            email,
            Desenvolvedor: {
              create: {
                nome: displayName,
                habilidades: 'OAuth',
              },
            },
          },
        });
      }

      done(null, login);
    } catch (err) {
      done(err, null);
    }
  }));
}
