import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import { watchProducts } from "./config/productWatcher.js";
import { globalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

// ================== APP ==================
const app = express();
const port = process.env.PORT || 4000;

// URLs permitidas (seu frontend e admin)
const allowedOrigins = [
  "https://sytudio.onrender.com",
  "https://sytudioadmin.onrender.com",
  "http://localhost:3000",   // Admin (dev - porta 3000)
  "http://localhost:5173",   // Frontend (dev - porta 5173)
  "http://localhost:5174"    // Admin (dev - porta 5174) - Vite default
];

// ================== MIDDLEWARES DE SEGURANÇA ==================

// Helmet - Adiciona headers de segurança
app.use(helmet());

// CORS - Restrito às origens permitidas
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS não permitido"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rate limiting global
app.use(globalLimiter);

// ================== DB ==================
connectDB();

// ================== ROUTES ==================
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/deliveries", deliveryRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API Working - Sytudio Backend");
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint não encontrado" });
});

// ================== SERVER + SOCKET ==================
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Middleware de autenticação para Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Token não fornecido"));
  }
  // validação do token aqui (implementar depois se necessário)
  next();
});

io.on("connection", socket => {
  console.log("🟢 Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

// ================== WATCHER ==================
watchProducts(io);

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err.message);

  // Não expor detalhes internos em produção
  const message = process.env.NODE_ENV === "production"
    ? "Erro no servidor"
    : err.message;

  res.status(err.status || 500).json({ message });
});

// ================== START ==================
server.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});
