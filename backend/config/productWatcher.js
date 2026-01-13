import Product from "../models/Product.js";
import { io } from "../server.js";

export const watchProducts = () => {
  Product.watch().on("change", async () => {
    const products = await Product.find().sort({ createdAt: -1 });
    io.emit("productsUpdated", products);
  });
};
