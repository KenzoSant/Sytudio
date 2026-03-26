import Delivery from "../models/Delivery.js";

/**
 * POST - Criar entrega
 */
export const createDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create({
      cliente: req.body.cliente.trim(),
      endereco: req.body.endereco.trim(),
      valorVenda: Number(req.body.valorVenda),
      valorGasto: Number(req.body.valorGasto || 0),
      dataEntrega: req.body.dataEntrega,
      statusEntrega: req.body.statusEntrega || "pendente",
      notas: req.body.notas?.trim()
    });

    res.status(201).json({
      message: "Entrega criada com sucesso",
      delivery
    });
  } catch (err) {
    console.error("❌ Erro ao criar entrega:", err);
    
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Validação falhou",
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ message: "Erro ao criar entrega" });
  }
};

/**
 * GET - Listar entregas
 */
export const getDeliveries = async (req, res) => {
  try {
    // Paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtros
    const filter = {};
    
    if (req.query.status) {
      filter.statusEntrega = req.query.status;
    }

    const deliveries = await Delivery.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ dataEntrega: 1 });

    const total = await Delivery.countDocuments(filter);

    res.json({
      message: "Entregas listadas com sucesso",
      data: deliveries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("❌ Erro ao listar entregas:", err);
    res.status(500).json({ message: "Erro ao listar entregas" });
  }
};

/**
 * PUT - Atualizar entrega
 */
export const updateDelivery = async (req, res) => {
  try {
    // Verificar se a entrega existe
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ message: "Entrega não encontrada" });
    }

    // Atualizar apenas os campos fornecidos
    const updateData = {};
    
    if (req.body.cliente) updateData.cliente = req.body.cliente.trim();
    if (req.body.endereco) updateData.endereco = req.body.endereco.trim();
    if (req.body.valorVenda !== undefined) updateData.valorVenda = Number(req.body.valorVenda);
    if (req.body.valorGasto !== undefined) updateData.valorGasto = Number(req.body.valorGasto);
    if (req.body.dataEntrega) updateData.dataEntrega = req.body.dataEntrega;
    if (req.body.statusEntrega) updateData.statusEntrega = req.body.statusEntrega;
    if (req.body.notas !== undefined) updateData.notas = req.body.notas?.trim();

    const updated = await Delivery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Entrega atualizada com sucesso",
      delivery: updated
    });
  } catch (err) {
    console.error("❌ Erro ao atualizar entrega:", err);
    
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Validação falhou",
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ message: "Erro ao atualizar entrega" });
  }
};

/**
 * DELETE - Remover entrega
 */
export const deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ message: "Entrega não encontrada" });
    }

    res.json({ message: "Entrega removida com sucesso" });
  } catch (err) {
    console.error("❌ Erro ao deletar entrega:", err);
    res.status(500).json({ message: "Erro ao remover entrega" });
  }
};
