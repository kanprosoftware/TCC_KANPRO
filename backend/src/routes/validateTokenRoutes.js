import express, { Router } from "express";
import { authenticateTempToken } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post('/validate-reset-token', authenticateTempToken, (req, res) => {
    // console.log("res: ", req.user.login_id);
  return res.status(200).json({ valid: true, login_id: req.user.login_id });
});
export default router;
