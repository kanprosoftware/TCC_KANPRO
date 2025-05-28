import passport from 'passport';
import googleStrategy from '../strategies/google.js';
import githubStrategy from '../strategies/github.js';
import microsoftStrategy from '../strategies/microsoft.js';
import linkedinStrategy from '../strategies/linkedin.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function configurePassport() {
  console.log("Configuring passport strategies");
  googleStrategy(passport);
  githubStrategy(passport);
  microsoftStrategy(passport);
  linkedinStrategy(passport);
    
  passport.serializeUser((user, done) => {
    done(null, user.login.login_id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
        console.log("id", id);
      const user = await prisma.login.findUnique({ where: { login_id: id } });
      console.log("user", user);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

export default configurePassport;