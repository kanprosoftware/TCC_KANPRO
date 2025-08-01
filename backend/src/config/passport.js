import passport from 'passport';
import googleStrategy from '../strategies/google.js';
import githubStrategy from '../strategies/github.js';
import microsoftStrategy from '../strategies/microsoft.js';
import linkedinStrategy from '../strategies/linkedin.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function configurePassport() {
  googleStrategy(passport);
  githubStrategy(passport);
  microsoftStrategy(passport);
  linkedinStrategy(passport);
    
  passport.serializeUser((user, done) => {
    console.log("user: ", user);
    done(null, user.login.login_id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.login.findUnique({ where: { login_id: id } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

export default configurePassport;

