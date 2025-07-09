import express from "express";
import  { getTecnology } from "../controllers/tecnologyController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js"

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Technologies
 *   description: Gerenciamento e listagem das tecnologias disponíveis no sistema
 */

/**
 * @swagger
 * /tecnologys/listTecnologys:
 *   get:
 *     summary: Lista todas as tecnologias disponíveis
 *     tags: [Technologies]
 *     responses:
 *       200:
 *         description: Lista de tecnologias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tecnologia_id:
 *                     type: integer
 *                     example: 1
 *                   descricao:
 *                     type: string
 *                     example: "JavaScript"
 *       500:
 *         description: Erro interno do servidor ao listar tecnologias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */
router.get("/listTecnologys", getTecnology);

export default router;