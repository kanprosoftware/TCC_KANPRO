import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { redirectWithToken } from '../controllers/oauthController.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: OAuth
 *   description: Rotas para autenticação via provedores externos (Google, GitHub, Microsoft, LinkedIn)
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Iniciar login com Google
 *     description: Redireciona o usuário para o Google para autenticação via OAuth.
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirecionamento para o login do Google
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback do Google
 *     description: |
 *       Rota de retorno após login com Google. Redireciona o usuário conforme seu estado:
 *         - Se não tem habilidades: /registro?etapa=2&token=...
 *         - Se e-mail não verificado: /login?erro=email-nao-verificado
 *         - Caso contrário: /projetos
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirecionamento conforme estado do usuário
 */
router.get('/google/callback', passport.authenticate('google', { session: true, failureRedirect: '/login-failure' }), redirectWithToken);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Iniciar login com GitHub
 *     description: |
 *       Redireciona o usuário para a página de autenticação do GitHub via OAuth.
 *       Após o login, o usuário será redirecionado de volta para o callback definido em:
 *       `/auth/github/callback`.
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirecionamento para o login do GitHub
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: Callback do GitHub
 *     description: |
 *       Rota de retorno após autenticação via GitHub. Redireciona o usuário de acordo com seu estado:
 *         - Se não possui habilidades cadastradas: redireciona para `/registro?etapa=2&token=...`
 *         - Se o e-mail ainda não foi verificado: redireciona para `/login?erro=email-nao-verificado`
 *         - Caso contrário: redireciona para `/projetos`
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirecionamento conforme estado do usuário
 */
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login-failure' }), redirectWithToken);

/**
 * @swagger
 * /auth/microsoft:
 *   get:
 *     summary: Iniciar login com Microsoft
 *     description: |
 *       Redireciona o usuário para a página de autenticação da Microsoft via OAuth.
 *       Após a autenticação, o usuário será redirecionado de volta para o callback definido em:
 *       `/auth/microsoft/callback`.
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirecionamento para o login da Microsoft
 */
router.get('/microsoft', passport.authenticate('microsoft', { scope: ['user.read'] }));
/**
 * @swagger
 * /auth/microsoft/callback:
 *   get:
 *     summary: Callback da Microsoft
 *     description: |
 *       Rota de retorno após autenticação via Microsoft. Redireciona o usuário de acordo com seu estado:
 *         - Se não possui habilidades cadastradas: redireciona para `/registro?etapa=2&token=...`
 *         - Se o e-mail ainda não foi verificado: redireciona para `/login?erro=email-nao-verificado`
 *         - Caso contrário: redireciona para `/projetos`
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirecionamento conforme estado do usuário
 */
router.get('/microsoft/callback', passport.authenticate('microsoft', { session: true, failureRedirect: '/login-failure' }), redirectWithToken);

/**
 * @swagger
 * /auth/linkedin:
 *   get:
 *     summary: Iniciar login com LinkedIn
 *     description: |
 *       Redireciona o usuário para a página de autenticação do LinkedIn via OAuth.
 *       Após a autenticação, o usuário será redirecionado de volta para o callback definido em:
 *       `/auth/linkedin/callback`.
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirecionamento para o login do LinkedIn
 */
router.get('/linkedin', passport.authenticate('linkedin', { scope: [ 'openid', 'profile', 'email'] }));
/**
 * @swagger
 * /auth/linkedin/callback:
 *   get:
 *     summary: Callback do LinkedIn
 *     description: |
 *       Rota de retorno após autenticação via LinkedIn. Redireciona o usuário de acordo com seu estado:
 *         - Se não possui habilidades cadastradas: redireciona para `/registro?etapa=2&token=...`
 *         - Se o e-mail ainda não foi verificado: redireciona para `/login?erro=email-nao-verificado`
 *         - Caso contrário: redireciona para `/projetos`
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirecionamento conforme estado do usuário
 */
router.get('/linkedin/callback', passport.authenticate('linkedin', { session: false, failureRedirect: '/login-failure' }), redirectWithToken);

/**
 * @swagger
 * /auth/login-failure:
 *   get:
 *     summary: Falha no login OAuth
 *     description: Rota chamada quando a autenticação com o provedor OAuth falha. Retorna erro 401.
 *     tags: [OAuth]
 *     responses:
 *       401:
 *         description: Falha ao autenticar com o provedor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Falha no login"
 */
router.get('/login-failure', (req, res) => {
  res.status(401).json({ error: 'Falha no login' });
});

export default router;