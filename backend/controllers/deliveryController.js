import Delivery from "../models/Delivery.js";

// Criar entrega
export const createDelivery = async (req, res) => {
  const delivery = await Delivery.create(req.body);
  res.json(delivery);
};

// Listar entregas
export const getDeliveries = async (req, res) => {
  const deliveries = await Delivery.find().sort({ dataEntrega: 1 });
  res.json(deliveries);
};

// Atualizar entrega
export const updateDelivery = async (req, res) => {
  const delivery = await Delivery.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(delivery);
};

// Deletar
export const deleteDelivery = async (req, res) => {
  await Delivery.findByIdAndDelete(req.params.id);
  res.json({ message: "Entrega removida" });
};
