import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../../context/AdminContext";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import ProductImageCarousel from "../../components/ProductImageCarousel/ProductImageCarousel";
import "./ListProduct.css";

export default function ListProduct() {
  const { getProducts, deleteProduct, updateProduct } = useAdmin();

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const askDelete = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    await deleteProduct(productToDelete._id);
    setShowConfirm(false);
    setSuccess("Produto removido com sucesso!");
    loadProducts();
  };

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setError("Erro ao carregar produtos: " + error.message);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [getProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const startEdit = (product) => {
    setEditingId(product._id);

    const imagens = Array.isArray(product.imagemUrl)
      ? product.imagemUrl
      : product.imagemUrl
        ? [product.imagemUrl]
        : [];

    setEditForm({
      nome: product.nome || "",
      descricao: product.descricao || "",
      valor: product.valor || "",
      quantidade: product.quantidade || "",
      imagemUrl: imagens, // existentes
      novasImagens: [] // Files
    });

    setError("");
    setSuccess("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files || []);
    setEditForm((prev) => ({
      ...prev,
      novasImagens: files
    }));
  };

  const removeExistingImage = (url) => {
    setEditForm((prev) => ({
      ...prev,
      imagemUrl: (prev.imagemUrl || []).filter((u) => u !== url)
    }));
  };

  const handleUpdate = async (id) => {
    if (
      !editForm.nome ||
      !editForm.descricao ||
      !editForm.valor ||
      editForm.quantidade === undefined ||
      editForm.quantidade === null
    ) {
      setError("Todos os campos são obrigatórios!");
      return;
    }

    try {
      const data = new FormData();
      data.append("nome", editForm.nome.trim());
      data.append("descricao", editForm.descricao.trim());
      data.append("valor", parseFloat(editForm.valor).toFixed(2));
      data.append("quantidade", parseInt(editForm.quantidade));

      // imagens que devem permanecer
      data.append("imagemUrl", JSON.stringify(editForm.imagemUrl || []));

      // novas imagens (até completar 3 no total)
      const remainingSlots = Math.max(
        0,
        3 - ((editForm.imagemUrl || []).length || 0)
      );

      (editForm.novasImagens || [])
        .slice(0, remainingSlots)
        .forEach((f) => data.append("imagem", f));

      const res = await updateProduct(id, data);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Falha ao atualizar");
      }

      setSuccess("Produto atualizado com sucesso!");
      setEditingId(null);
      loadProducts();

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Erro ao atualizar produto: " + error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setError("");
  };

  return (
    <div className="list-product-container">
      <div className="list-header">
        <h2>
          <i className="bx bx-package"></i> Lista de Produtos
        </h2>
        <p>Gerencie seus produtos cadastrados</p>

        <div className="stats">
          <div className="stat-card">
            <i className="bx bx-box"></i>
            <span>Total: {products.length}</span>
          </div>
          <div className="stat-card">
            <i className="bx bx-dollar"></i>
            <span>
              Valor Total: R${" "}
              {products
                .reduce(
                  (total, p) =>
                    total +
                    (parseFloat(p.valor) || 0) * (parseInt(p.quantidade) || 0),
                  0
                )
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert error">
          <i className="bx bx-error-circle"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="alert success">
          <i className="bx bx-check-circle"></i>
          {success}
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <i className="bx bx-loader-alt bx-spin"></i>
          <p>Carregando produtos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <i className="bx bx-package"></i>
          <h3>Nenhum produto cadastrado</h3>
          <p>Adicione seu primeiro produto para começar!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className={`product-card ${editingId === product._id ? "editing" : ""
                }`}
            >
              {editingId === product._id ? (
                <div className="edit-form">
                  <h3>Editar Produto</h3>

                  <div className="form-group">
                    <label>Nome</label>
                    <input
                      type="text"
                      name="nome"
                      value={editForm.nome}
                      onChange={handleEditChange}
                      placeholder="Nome do produto"
                    />
                  </div>

                  <div className="form-group">
                    <label>Descrição</label>
                    <textarea
                      name="descricao"
                      value={editForm.descricao}
                      onChange={handleEditChange}
                      placeholder="Descrição do produto"
                      rows="3"
                    />
                  </div>

                  {/* IMAGENS (remover atuais / adicionar novas) */}
                  <div className="form-group">
                    <label>Imagens</label>

                    <div className="edit-images">
                      {(editForm.imagemUrl || []).map((url) => (
                        <div key={url} className="edit-image-item">
                          <img src={url} alt="Imagem" />
                          <button
                            type="button"
                            className="remove-image-mini"
                            onClick={() => removeExistingImage(url)}
                            title="Remover imagem"
                          >
                            <i className="bx bx-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>

                    <input
                      type="file"
                      name="imagem"
                      accept="image/*"
                      multiple
                      onChange={handleNewImages}
                    />
                    <small style={{ opacity: 0.8 }}>
                      Você pode manter/remover as atuais e adicionar novas
                      (máximo 3 no total).
                    </small>
                  </div>

                  <div className="form-group">
                    <div className="form-group">
                      <label>Valor (R$)</label>
                      <input
                        type="number"
                        name="valor"
                        value={editForm.valor}
                        onChange={handleEditChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label>Quantidade</label>
                      <input
                        type="number"
                        name="quantidade"
                        value={editForm.quantidade}
                        onChange={handleEditChange}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      className="save-btn"
                      onClick={() => handleUpdate(product._id)}
                    >
                      <i className="bx bx-save"></i>
                      Salvar
                    </button>
                    <button className="cancel-btn" onClick={cancelEdit}>
                      <i className="bx bx-x"></i>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="product-image">
                    <ProductImageCarousel imagemUrl={product.imagemUrl} nome={product.nome} />
                  </div>

                  <div className="product-content">
                    <h3 className="product-title">{product.nome}</h3>
                    <p className="product-description">{product.descricao}</p>

                    <div className="product-details">
                      <div className="detail">
                        <span>
                          R$ {parseFloat(product.valor || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="detail">
                        <i className="bx bx-box"></i>
                        <span>{product.quantidade} unidades</span>
                      </div>
                    </div>

                    <div className="product-actions">
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(product)}
                      >
                        <i className="bx bx-edit"></i>
                        Editar
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => askDelete(product)}
                      >
                        <i className="bx bx-trash"></i>
                        Remover
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={showConfirm}
        title="Confirmar exclusão"
        message={`Deseja remover o produto "${productToDelete?.nome}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
