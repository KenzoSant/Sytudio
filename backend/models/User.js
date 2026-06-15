import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nome é obrigatório"],
    minlength: [2, "Nome deve ter no mínimo 2 caracteres"],
    maxlength: [100, "Nome não pode exceder 100 caracteres"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email é obrigatório"],
    unique: [true, "Este email já está cadastrado"],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"]
  },
  password: {
    type: String,
    required: [true, "Senha é obrigatória"],
    minlength: [8, "Senha deve ter no mínimo 8 caracteres"],
    select: false // Não retorna senha por padrão
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Índice para otimizar buscas por data de criação
userSchema.index({ createdAt: 1 });

export default mongoose.model("User", userSchema);
