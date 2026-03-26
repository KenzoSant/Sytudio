import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  cliente: {
    type: String,
    required: [true, "Nome do cliente é obrigatório"],
    minlength: [2, "Nome deve ter no mínimo 2 caracteres"],
    maxlength: [100, "Nome não pode exceder 100 caracteres"],
    trim: true,
    index: true
  },
  endereco: {
    type: String,
    required: [true, "Endereço é obrigatório"],
    minlength: [5, "Endereço deve ter no mínimo 5 caracteres"],
    maxlength: [300, "Endereço não pode exceder 300 caracteres"],
    trim: true
  },
  valorVenda: {
    type: Number,
    required: [true, "Valor da venda é obrigatório"],
    min: [0.01, "Valor deve ser maior que zero"]
  },
  valorGasto: {
    type: Number,
    default: 0,
    min: [0, "Valor não pode ser negativo"]
  },
  dataEntrega: {
    type: Date,
    required: [true, "Data de entrega é obrigatória"],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: "Data deve ser no futuro"
    }
  },
  statusEntrega: {
    type: String,
    enum: {
      values: ["pendente", "enviado", "entregue", "cancelado"],
      message: "Status inválido"
    },
    default: "pendente",
    index: true
  },
  notas: {
    type: String,
    maxlength: [500, "Notas não podem exceder 500 caracteres"],
    trim: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Índices para otimizar buscas
deliverySchema.index({ cliente: 1, statusEntrega: 1 });
deliverySchema.index({ dataEntrega: 1 });

export default mongoose.model("Delivery", deliverySchema);
