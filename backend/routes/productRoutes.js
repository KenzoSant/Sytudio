import express from "express";
import upload from "../middleware/upload.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import { 
  validateProduct, 
  validateProductUpdate,
  validateMongoId 
} from "../middleware/validateInput.js";
import { productLimiter, writeLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// GET - Listar produtos (público, mas com rate limiting)
router.get("/", productLimiter, getProducts);

// POST - Criar produto (admin apenas)
router.post(
  "/", 
  authMiddleware,
  adminMiddleware,
  writeLimiter,
  upload.array("imagem", 3), 
  validateProduct,
  createProduct
);

// PUT - Atualizar produto (admin apenas)
router.put(
  "/:id", 
  authMiddleware,
  adminMiddleware,
  writeLimiter,
  validateMongoId,
  upload.array("imagem", 3), 
  validateProductUpdate,
  updateProduct
);

// DELETE - Deletar produto (admin apenas)
router.delete(
  "/:id", 
  authMiddleware,
  adminMiddleware,
  writeLimiter,
  validateMongoId,
  deleteProduct
);

export default router;
