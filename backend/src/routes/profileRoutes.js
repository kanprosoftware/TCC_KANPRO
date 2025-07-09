import express from "express";
import { profile, updateProfileName, updateProfileEmail, updateProfileSenha, updateProfileHabilidades, includeUpdateProfileFoto } from "../controllers/profileController.js";
import { validate } from "../middlewares/validationMiddleware.js";
// import { createCategorySchema } from "../validators/categoryValidator.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Gerenciamento e atualização de perfis de usuário
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtem o perfil de um usuário específico
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de projetos
 *       400:
 *         description: Erro ao listar projetos
 */
router.get("/", authenticateToken, profile);

/**
 * @swagger
 * /profile/updateProfileName:
 *   put:
 *     summary: Atualizar nome do usuário
 *     description: Atualiza o nome do perfil do usuário autenticado.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome do usuário
 *                 example: "João Silva"
 *     responses:
 *       200:
 *         description: Nome atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario_id:
 *                   type: integer
 *                   example: 123
 *                 nome:
 *                   type: string
 *                   example: "João Silva"
 *       400:
 *         description: Erro ao atualizar o nome
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao atualizar nome do usuário"
 */
router.put("/updateProfileName", authenticateToken, updateProfileName);

/**
 * @swagger
 * /profile/updateProfileEmail:
 *   put:
 *     summary: Atualizar e-mail do usuário
 *     description: Atualiza o e-mail do perfil do usuário autenticado e envia um novo e-mail de verificação.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailAtual
 *               - emailNovo
 *             properties:
 *               emailAtual:
 *                 type: string
 *                 description: E-mail atual do usuário
 *                 example: "usuario@kanpro.com"
 *               emailNovo:
 *                 type: string
 *                 description: Novo e-mail que será associado ao usuário
 *                 example: "novoemail@kanpro.com"
 *     responses:
 *       200:
 *         description: E-mail atualizado com sucesso (aguardando verificação)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 login_id:
 *                   type: integer
 *                   example: 123
 *                 email:
 *                   type: string
 *                   example: "novoemail@kanpro.com"
 *                 is_verified:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Erro ao atualizar o e-mail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email registrado para login com: Google"
 */
router.put("/updateProfileEmail", authenticateToken, updateProfileEmail);

/**
 * @swagger
 * /profile/updateProfileSenha:
 *   put:
 *     summary: Atualizar senha do usuário
 *     description: Atualiza a senha do usuário autenticado, desde que a senha atual seja válida. Apenas para contas com login local (não OAuth).
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senhaAtual
 *               - senhaNova
 *             properties:
 *               senhaAtual:
 *                 type: string
 *                 description: Senha atual do usuário
 *                 example: "senhaAntiga123"
 *               senhaNova:
 *                 type: string
 *                 description: Nova senha do usuário
 *                 example: "senhaNovaSegura456"
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 login_id:
 *                   type: integer
 *                   example: 123
 *                 password:
 *                   type: string
 *                   example: "$2b$10$hashsegurogerado"
 *       400:
 *         description: Erro ao atualizar a senha
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Senha atual incorreta"
 */
router.put("/updateProfileSenha", authenticateToken, updateProfileSenha);

/**
 * @swagger
 * /profile/updateProfileHabilidades:
 *   put:
 *     summary: Atualizar habilidades do usuário
 *     description: Substitui todas as habilidades do usuário autenticado pelas novas enviadas.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
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
 *                 description: Lista de IDs das tecnologias/habilidades do usuário
 *                 items:
 *                   type: integer
 *                 example: [1, 3, 5]
 *     responses:
 *       200:
 *         description: Habilidades atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Erro ao atualizar habilidades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao atualizar habilidades"
 */
router.put("/updateProfileHabilidades", authenticateToken, updateProfileHabilidades);

/**
 * @swagger
 * /profile/includeUpdateProfileFoto:
 *   put:
 *     summary: Enviar ou atualizar foto de perfil do usuário
 *     description: Envia uma nova foto de perfil ou atualiza a existente para o usuário autenticado.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Arquivo da imagem de perfil (apenas 1 esperado)
 *     responses:
 *       200:
 *         description: Foto de perfil enviada ou atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 login_id:
 *                   type: string
 *                   example: "clz9999ff0001ws31sa2cc6p3"
 *                 nome:
 *                   type: string
 *                   example: "foto_perfil.png"
 *                 tipo:
 *                   type: string
 *                   example: "image/png"
 *       400:
 *         description: Erro ao enviar ou atualizar a foto de perfil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao atualizar foto de perfil"
 */
router.put("/includeUpdateProfileFoto", authenticateToken, upload.array("foto"), includeUpdateProfileFoto);

export default router;