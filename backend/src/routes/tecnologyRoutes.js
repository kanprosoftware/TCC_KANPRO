import express from "express";
import  { getTecnology } from "../controllers/tecnologyController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js"

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tecnology
 *   description: Gerenciamento de autenticação
 */

/**
 * @swagger
 * /tecnologys/listTecnologys:
 *   get:
 *     summary: Lista todas as tecnologias
 *     tags: [Tecnology]
 *     responses:
 *       200:
 *         description: Lista as tecnologias
 *       400:
 *         description: Erro ao listar tecnologias
 */
//router.get("/listTecnologys", authenticateToken, getTecnology);
router.get("/listTecnologys", getTecnology);

export default router;