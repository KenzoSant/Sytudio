import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware de autenticação JWT
 * Valida token e anexa usuário ao request
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido" });
    }
    res.status(500).json({ message: "Erro na autenticação" });
  }
};

/**
 * Middleware verificar se é admin
 * Usa authMiddleware antes
 */
export const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Acesso negado. Apenas administradores" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Erro ao verificar permissões" });
  }
};
