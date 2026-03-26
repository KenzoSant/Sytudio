import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRATION = "7d";

/**
 * Gerar JWT Token
 */
const generateToken = (userId) => {
  try {
    console.log("📝 Gerando token com JWT_SECRET:", JWT_SECRET.substring(0, 10) + "...");
    console.log("📝 User ID:", userId);
    
    const token = jwt.sign(
      { id: userId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );
    
    console.log("✅ Token gerado com sucesso");
    return token;
  } catch (err) {
    console.error("❌ Erro ao gerar token:", err.message);
    throw err;
  }
};

/* =======================
   REGISTER
======================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verifyToken: verifyToken,
      verified: false,
      role: "user"
    });

    const link = `${process.env.ADMIN_URL}/verify/${verifyToken}`;

    await sendEmail(
      email,
      "Confirme seu email",
      `
      <h2>Confirme sua conta</h2>
      <p>Olá ${name},</p>
      <p>Clique abaixo para ativar sua conta:</p>
      <a href="${link}" style="padding:10px 20px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">
        Confirmar conta
      </a>
      <p style="color:#666;font-size:12px;">Esse link expira em 24 horas.</p>
      `
    );

    res.status(201).json({ 
      message: "Verifique seu email para ativar a conta",
      email: user.email
    });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

/* =======================
   LOGIN
======================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Tentativa de login:", email);

    // Verificar se o usuário existe (incluir password com select)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("❌ Usuário não encontrado:", email);
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    console.log("✅ Usuário encontrado:", user.email);

    // Verificar se o email foi confirmado
    if (!user.verified) {
      console.log("⚠️ Email não verificado:", email);
      return res.status(403).json({ 
        message: "Confirme seu email antes de logar",
        email: user.email
      });
    }

    console.log("✅ Email verificado");

    // Verificar a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Senha incorreta para:", email);
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    console.log("✅ Senha correta");

    // Gerar token JWT no servidor
    console.log("🔑 Gerando token JWT...");
    const token = generateToken(user._id);
    console.log("✅ Token gerado:", token.substring(0, 20) + "...");

    console.log("✅ Login bem-sucedido para:", user.email);

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    console.error("❌ ERRO NO LOGIN:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({ 
      message: "Erro no servidor",
      error: err.message 
    });
  }
};

/* =======================
   VERIFY EMAIL
======================= */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verifyToken: token });

    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    user.verified = true;
    user.verifyToken = null;
    await user.save();

    res.json({ message: "Email confirmado com sucesso! Agora você pode fazer login." });
  } catch (err) {
    console.error("Erro ao verificar email:", err);
    res.status(500).json({ message: "Erro ao confirmar email" });
  }
};

/* =======================
   GET CURRENT USER
======================= */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

/* =======================
   REFRESH TOKEN
======================= */
export const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const newToken = generateToken(user._id);

    res.json({ 
      message: "Token renovado com sucesso",
      token: newToken 
    });
  } catch (err) {
    console.error("Erro ao renovar token:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
};
