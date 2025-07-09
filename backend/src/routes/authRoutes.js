import express from "express";
import { register, login, verifyEmail, logout, completeProfile, firstUser, getUsers, updateRouleUser, disableUserById, forgotPasswordEmail, resetPasswordUser } from "../controllers/authController.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";
import { authenticateToken, authenticateTempToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gerenciamento de autenticação, login, registro e recuperação de senha
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *               - habilidades
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 example: securepassword123
 *               habilidades:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["SQL", "C#", "COBOL"]
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
// router.post("/register", validate(registerSchema), register);
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Faz login e retorna um token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /auth/verify-email:
 *   put:
 *     summary: Verificar o e-mail do usuário
 *     description: Verifica o e-mail do usuário através de um token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: O token de verificação do e-mail.
 *                 example: "seu-token-aqui"
 *     responses:
 *       200:
 *         description: E-mail verificado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully"
 *       400:
 *         description: Erro de token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or expired token"
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access token is required"
 *       403:
 *         description: Token inválido ou payload do token incorreto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid token payload"
 */
router.post("/verify-email", verifyEmail);

/**
 * @swagger
 * /auth/forgotPasswordEmail:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     description: Envia um e-mail com link para redefinir a senha do usuário.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário que deseja redefinir a senha
 *                 example: "usuario@kanpro.com"
 *     responses:
 *       200:
 *         description: E-mail enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email enviado"
 *       404:
 *         description: E-mail não encontrado ou erro ao enviar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email não encontrado!"
 */
router.post("/forgotPasswordEmail", forgotPasswordEmail);

/**
 * @swagger
 * /auth/resetPasswordUser:
 *   put:
 *     summary: Redefinir a senha do usuário
 *     description: Atualiza a senha do usuário com base no token temporário de autenticação.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Nova senha do usuário
 *                 example: "novaSenhaSegura123"
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 login_id:
 *                   type: string
 *                   example: "clz9999ff0001ws31sa2cc6p3"
 *                 email:
 *                   type: string
 *                   example: "usuario@kanpro.com"
 *       400:
 *         description: Erro ao atualizar a senha
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao atualizar a senha!"
 */
router.put("/resetPasswordUser", authenticateTempToken, resetPasswordUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Faz logout do usuário
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 */
router.post("/logout", authenticateToken, logout);

/**
 * @swagger
 * /auth/complete-profile:
 *   post:
 *     summary: Completa o perfil do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - habilidades
 *             properties:
 *               habilidades:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "Node.js", "React"]
 *     responses:
 *       200:
 *         description: Perfil completado com sucesso
 */
router.post('/complete-profile', authenticateTempToken, completeProfile);

/**
 * @swagger
 * /auth/primeiroUser:
 *   get:
 *     summary: Verifica se é o primeiro usuário
 *     description: Verifica se é o primeiro usuário
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Retorna true se for o primeiro usuário, false caso contrário
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/primeiroUser", firstUser)

/**
 * @swagger
 * /auth/getUsers:
 *   get:
 *     summary: Recebe todos os usuarios cadastrados
 *     description: Verifica se é o primeiro usuário
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Retorna true se for o primeiro usuário, false caso contrário
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/getUsers', authenticateToken, getUsers);

/**
 * @swagger
 * /auth/updateRouleUser:
 *   put:
 *     summary: Atualizar papel do usuário
 *     description: Atualiza o campo de role (papel) de um usuário específico.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - role
 *             properties:
 *               usuario_id:
 *                 type: string
 *                 description: ID do usuário a ter a role atualizada
 *                 example: "clz9999ff0001ws31sa2cc6p3"
 *               role:
 *                 type: string
 *                 description: "Novo papel do usuário (ex: ADMIN, USER, etc.)"
 *                 example: "ADMIN"
 *     responses:
 *       200:
 *         description: Papel do usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updateRouleUsers:
 *                   type: object
 *                   properties:
 *                     usuario_id:
 *                       type: string
 *                       example: "clz9999ff0001ws31sa2cc6p3"
 *                     roule:
 *                       type: string
 *                       example: "ADMIN"
 *       500:
 *         description: Erro ao atualizar papel do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Erro ao atualizar regra de usuario"
 */
router.put('/updateRouleUser', authenticateToken, updateRouleUser);

/**
 * @swagger
 * /auth/disableUserById:
 *   put:
 *     summary: Desativar usuário
 *     description: Desativa um usuário no sistema (define o campo "ativo" como false).
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 description: ID do usuário que será desativado
 *                 example: 123
 *     responses:
 *       200:
 *         description: Usuário desativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 disableUserId:
 *                   type: object
 *                   properties:
 *                     login_id:
 *                       type: integer
 *                       example: 123
 *                     ativo:
 *                       type: boolean
 *                       example: false
 *       500:
 *         description: Erro ao desativar o usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Erro ao desativar usuario"
 */
router.put('/disableUserById', authenticateToken, disableUserById);

export default router;