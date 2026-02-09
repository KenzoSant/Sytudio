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

    console.log("FILES:", req.files?.length, req.files?.map(f => ({ mimetype: f.mimetype, size: f.size })));
    console.log("BODY:", req.body);


    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Imagem é obrigatória" });
    }

    const results = await Promise.all(
      req.files.slice(0, 3).map((f) => uploadBufferToCloudinary(f.buffer))
    );

    const product = await Product.create({
      nome: req.body.nome,
      descricao: req.body.descricao,
      valor: Number(req.body.valor),
      quantidade: Number(req.body.quantidade),
      imagemUrl: results.map((r) => r.secure_url) // array
    });

    return res.status(201).json(product);
  } catch (err) {
    console.error("createProduct error:", err);
    return res.status(500).json({ error: err.message });
  }
};


// READ
export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

export const updateProduct = async (req, res) => {
  try {
    // imagemUrl pode vir como JSON string (recomendado) ou string única
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
      return res.status(400).json({ error: "Produto deve ter ao menos 1 imagem." });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        valor: req.body.valor !== undefined ? Number(req.body.valor) : undefined,
        quantidade: req.body.quantidade !== undefined ? Number(req.body.quantidade) : undefined,
        imagemUrl: finalUrls
      },
      { new: true }
    );

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Produto removido" });
};
