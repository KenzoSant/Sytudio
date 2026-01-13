import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// CREATE
export const createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Imagem é obrigatória" });
    }

    cloudinary.uploader.upload_stream(
      { folder: "products" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Erro ao enviar imagem" });
        }

        const product = await Product.create({
          nome: req.body.nome,
          descricao: req.body.descricao,
          valor: Number(req.body.valor),
          quantidade: Number(req.body.quantidade),
          imagemUrl: result.secure_url
        });

        return res.status(201).json(product);
      }
    ).end(req.file.buffer);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// READ
export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// UPDATE
export const updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// DELETE
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Produto removido" });
};
