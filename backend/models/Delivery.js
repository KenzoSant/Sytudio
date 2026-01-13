import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  cliente: String,
  figure: String,
  valorVenda: Number,
  valorGasto: Number,
  dataEntrega: Date,
  status: {
    type: String,
    enum: ["agendada", "entregue", "cancelada"],
    default: "agendada"
  }
}, { timestamps: true });

export default mongoose.model("Delivery", deliverySchema);
