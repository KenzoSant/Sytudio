import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

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

    const token = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verifyToken: token,
      verified: false,
    });

    const link = `${process.env.ADMIN_URL}/verify/${token}`;

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
      `
    );

    res.json({ message: "Verifique seu email para ativar a conta" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

/* =======================
   LOGIN
======================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

    if (!user.verified) {
      return res
        .status(401)
        .json({ message: "Confirme seu email antes de logar" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Senha incorreta" });

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro no servidor" });
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


    res.json({ message: "Email confirmado com sucesso" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro ao confirmar email" });
  }
};
