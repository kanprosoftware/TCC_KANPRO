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
 *   description: Gerenciamento de autenticação
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
 * path:
 *  /verify-email:
 *    put:
 *      summary: Verificar o e-mail do usuário
 *      description: Verifica o e-mail do usuário através de um token.
 *      tags: [Verificação de E-mail]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: O token de verificação do e-mail.
 *                  example: "seu-token-aqui"
 *      responses:
 *        200:
 *          description: E-mail verificado com sucesso
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Email verified successfully"
 *        400:
 *          description: Erro de token inválido ou expirado
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Invalid or expired token"
 *        401:
 *          description: Token não fornecido
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Access token is required"
 *        403:
 *          description: Token inválido ou payload do token incorreto
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Invalid token payload"
 */
router.post("/verify-email", verifyEmail);

router.post("/forgotPasswordEmail", forgotPasswordEmail);

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

router.put('/updateRouleUser', authenticateToken, updateRouleUser);

router.put('/disableUserById', authenticateToken, disableUserById);

export default router;