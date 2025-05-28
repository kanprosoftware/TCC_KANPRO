// src/strategies/microsoft.js
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function(passport) {
  passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/microsoft/callback`, // Ex: http://localhost:3000/auth/microsoft/callback
    scope: ['user.read'], // ou ['openid', 'profile', 'email']
    tenant: 'common',
  }, async (accessToken, refreshToken, profile, done) => {
    const provider = 'microsoft';
    const providerId = profile.id;
    const email = profile.emails?.[0]?.value || '';
    const displayName = profile.displayName || 'Usuário Microsoft';

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
