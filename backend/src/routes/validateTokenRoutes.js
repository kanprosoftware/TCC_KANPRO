import express, { Router } from "express";
import { authenticateTempToken } from "../middlewares/authMiddleware.js";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: AuthTemp
 *     description: Rotas de autenticação temporária (ex: redefinição de senha)
 */

/**
 * @swagger
 * /validate-reset-token:
 *   post:
 *     summary: Valida o token temporário de redefinição de senha
 *     description: Verifica se um token temporário é válido para permitir redefinição de senha.
 *     tags: [AuthTemp]
 *     security:
 *       - bearerAuth: []  
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT temporário
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 login_id:
 *                   type: integer
 *                   example: 42
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token temporário é obrigatório."
 *       403:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token temporário inválido ou expirado."
 */
router.post('/validate-reset-token', authenticateTempToken, (req, res) => {
  return res.status(200).json({ valid: true, login_id: req.user.login_id });
});
export default router;
