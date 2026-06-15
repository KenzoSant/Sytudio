import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "Nome do produto é obrigatório"],
    minlength: [3, "Nome deve ter no mínimo 3 caracteres"],
    maxlength: [200, "Nome não pode exceder 200 caracteres"],
    trim: true,
    index: true
  },
  descricao: {
    type: String,
    required: [true, "Descrição é obrigatória"],
    minlength: [10, "Descrição deve ter no mínimo 10 caracteres"],
    maxlength: [1000, "Descrição não pode exceder 1000 caracteres"],
    trim: true
  },
  valor: {
    type: Number,
    required: [true, "Valor é obrigatório"],
    min: [0.01, "Valor deve ser maior que zero"]
  },
  quantidade: {
    type: Number,
    required: [true, "Quantidade é obrigatória"],
    min: [0, "Quantidade não pode ser negativa"]
  },
  categoria: {
    type: String,
    trim: true
  },
  imagemUrl: { 
    type: [String], 
    required: [true, "Imagem é obrigatória"],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "Pelo menos uma imagem é necessária"
    }
  },
  ativo: {
    type: Boolean,
    default: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Índices para otimizar buscas
productSchema.index({ nome: "text", descricao: "text" });

export default mongoose.model("Product", productSchema);
