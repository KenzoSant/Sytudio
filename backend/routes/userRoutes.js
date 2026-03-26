import express from "express";
import { 
  registerUser, 
  loginUser, 
  verifyEmail,
  getCurrentUser,
  refreshToken 
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { 
  validateRegister, 
  validateLogin 
} from "../middleware/validateInput.js";
import { 
  registerLimiter, 
  loginLimiter 
} from "../middleware/rateLimiter.js";

const router = express.Router();

// Rotas públicas
router.post("/register", registerLimiter, validateRegister, registerUser);
router.post("/login", loginLimiter, validateLogin, loginUser);
router.get("/verify/:token", verifyEmail);

// Rotas protegidas (requerem autenticação)
router.get("/me", authMiddleware, getCurrentUser);
router.post("/refresh-token", authMiddleware, refreshToken);

export default router;
