import express from "express";
import {
  createDelivery,
  getDeliveries,
  updateDelivery,
  deleteDelivery
} from "../controllers/deliveryController.js";

const router = express.Router();

router.post("/", createDelivery);
router.get("/", getDeliveries);
router.put("/:id", updateDelivery);
router.delete("/:id", deleteDelivery);

export default router;
