import express from "express";
import upload from "../middleware/upload.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", upload.single("imagem"), createProduct);
router.get("/", getProducts);
router.get("/:id", async (req,res)=>{
  const p = await Product.findById(req.params.id);
  res.json(p);
});
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
