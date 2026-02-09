import express from "express";
import upload from "../middleware/upload.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// antes: upload.single("imagem")
router.post("/", upload.array("imagem", 3), createProduct);

router.get("/", getProducts);
router.get("/:id", async (req,res)=>{
  const p = await Product.findById(req.params.id);
  res.json(p);
});
router.put("/:id", upload.array("imagem", 3), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
