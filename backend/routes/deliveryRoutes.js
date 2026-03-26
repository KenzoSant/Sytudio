import express from "express";
import {
  createDelivery,
  getDeliveries,
  updateDelivery,
  deleteDelivery
} from "../controllers/deliveryController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import { 
  validateDelivery,
  validateMongoId 
} from "../middleware/validateInput.js";
import { writeLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// POST - Criar entrega (admin apenas)
router.post(
  "/", 
  authMiddleware,
  adminMiddleware,
  writeLimiter,
  validateDelivery,
  createDelivery
);

// GET - Listar entregas (admin apenas)
router.get(
  "/", 
  authMiddleware,
  adminMiddleware,
  getDeliveries
);

// PUT - Atualizar entrega (admin apenas)
router.put(
  "/:id", 
  authMiddleware,
  adminMiddleware,
  writeLimiter,
  validateMongoId,
  updateDelivery
);

// DELETE - Deletar entrega (admin apenas)
router.delete(
  "/:id", 
  authMiddleware,
  adminMiddleware,
  writeLimiter,
  validateMongoId,
  deleteDelivery
);

export default router;
