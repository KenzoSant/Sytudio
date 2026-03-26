import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

const uploadBufferToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });

export const createProduct = async (req, res) => {
  try {
    // Validação de imagens
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Imagem é obrigatória" });
    }

    // Fazer upload das imagens
    const results = await Promise.all(
      req.files.slice(0, 3).map((f) => uploadBufferToCloudinary(f.buffer))
    );

    // Criar produto com dados validados
    const product = await Product.create({
      nome: req.body.nome.trim(),
      descricao: req.body.descricao.trim(),
      categoria: req.body.categoria.trim(),
      valor: Number(req.body.valor),
      quantidade: Number(req.body.quantidade),
      imagemUrl: results.map((r) => r.secure_url),
      ativo: true
    });

    return res.status(201).json({
      message: "Produto criado com sucesso",
      product
    });
  } catch (err) {
    console.error("❌ Erro ao criar produto:", err);
    
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Validação falhou",
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    
    return res.status(500).json({ message: "Erro ao criar produto" });
  }
};

/**
 * GET - Listar todos os produtos
 */
export const getProducts = async (req, res) => {
  try {
    // Paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtros (remover filtro ativo para mostrar todos os produtos)
    const filter = {};
    
    if (req.query.categoria) {
      filter.categoria = req.query.categoria;
    }

    console.log("🔍 Buscando produtos com filtro:", filter);

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    console.log(`✅ Encontrados ${products.length} produtos de ${total} total`);

    res.json({
      message: "Produtos listados com sucesso",
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("❌ Erro ao listar produtos:", err);
    res.status(500).json({ message: "Erro ao listar produtos" });
  }
};

/**
 * PUT - Atualizar produto
 */
export const updateProduct = async (req, res) => {
  try {
    // Verificar se o produto existe
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    // Processar imagens
    let keepUrls = [];
    if (req.body.imagemUrl) {
      if (typeof req.body.imagemUrl === "string") {
        try {
          keepUrls = JSON.parse(req.body.imagemUrl);
          if (!Array.isArray(keepUrls)) keepUrls = [req.body.imagemUrl];
        } catch {
          keepUrls = [req.body.imagemUrl];
        }
      } else if (Array.isArray(req.body.imagemUrl)) {
        keepUrls = req.body.imagemUrl;
      }
    }

    let newUrls = [];
    if (req.files && req.files.length > 0) {
      const results = await Promise.all(
        req.files.map((f) => uploadBufferToCloudinary(f.buffer))
      );
      newUrls = results.map((r) => r.secure_url);
    }

    const finalUrls = [...keepUrls, ...newUrls].slice(0, 3);
    if (finalUrls.length === 0) {
      return res.status(400).json({ message: "Produto deve ter ao menos 1 imagem" });
    }

    // Atualizar produto
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.nome && { nome: req.body.nome.trim() }),
        ...(req.body.descricao && { descricao: req.body.descricao.trim() }),
        ...(req.body.categoria && { categoria: req.body.categoria.trim() }),
        ...(req.body.valor !== undefined && { valor: Number(req.body.valor) }),
        ...(req.body.quantidade !== undefined && { quantidade: Number(req.body.quantidade) }),
        imagemUrl: finalUrls
      },
      { new: true, runValidators: true }
    );

    return res.json({
      message: "Produto atualizado com sucesso",
      product: updated
    });
  } catch (err) {
    console.error("❌ Erro ao atualizar produto:", err);
    
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Validação falhou",
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    
    return res.status(500).json({ message: "Erro ao atualizar produto" });
  }
};

/**
 * DELETE - Remover produto
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.json({ message: "Produto removido com sucesso" });
  } catch (err) {
    console.error("❌ Erro ao deletar produto:", err);
    res.status(500).json({ message: "Erro ao remover produto" });
  }
};
