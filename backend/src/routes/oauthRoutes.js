import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { googleCallback } from '../controllers/oauthController.js';

const router = express.Router();

function redirectWithToken(req, res) {
  const login = req.user;
  const token = jwt.sign(
    { loginId: login.loginId },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token}`);
}

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: true, failureRedirect: '/login-failure' }), googleCallback);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login-failure' }), redirectWithToken);

router.get('/microsoft', passport.authenticate('microsoft', { scope: ['user.read'] }));
router.get('/microsoft/callback', passport.authenticate('microsoft', { session: false, failureRedirect: '/login-failure' }), redirectWithToken);

router.get('/linkedin', passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] }));
router.get('/linkedin/callback', passport.authenticate('linkedin', { session: false, failureRedirect: '/login-failure' }), redirectWithToken);

router.get('/login-failure', (req, res) => {
  res.status(401).json({ error: 'Falha no login' });
});

export default router;