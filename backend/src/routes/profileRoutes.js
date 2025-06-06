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
 *   description: Gerenciamento de perfis
 */
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtem o perfil de um usuário específico
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Lista de projetos
 *       400:
 *         description: Erro ao listar projetos
 */

router.get("/", authenticateToken, profile);

router.put("/updateProfileName", authenticateToken, updateProfileName);

router.put("/updateProfileEmail", authenticateToken, updateProfileEmail);

router.put("/updateProfileSenha", authenticateToken, updateProfileSenha);

router.put("/updateProfileHabilidades", authenticateToken, updateProfileHabilidades);

router.put("/includeUpdateProfileFoto", authenticateToken, upload.array("foto"), includeUpdateProfileFoto);

export default router;