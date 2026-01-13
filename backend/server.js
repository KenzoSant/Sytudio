import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import { watchProducts } from "./config/productWatcher.js";

dotenv.config();

// ================== APP ==================
const app = express();
const port = process.env.PORT || 4000;

// ================== MIDDLEWARES ==================
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// ================== DB ==================
connectDB();

// ================== ROUTES ==================
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/deliveries", deliveryRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API Working");
});

// ================== SERVER + SOCKET ==================
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", socket => {
  console.log("🟢 Cliente conectado:", socket.id);
});

// ================== WATCHER ==================
watchProducts(io); 

// ================== START ==================
server.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});
