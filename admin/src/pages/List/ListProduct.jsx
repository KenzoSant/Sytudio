// components/ListProduct/ListProduct.jsx
import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../../context/AdminContext";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal"
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
    setEditForm({
      nome: product.nome || "",
      descricao: product.descricao || "",
      valor: product.valor || "",
      quantidade: product.quantidade || ""
    });
    setError("");
    setSuccess("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (id) => {
    if (!editForm.nome || !editForm.descricao || !editForm.valor || !editForm.quantidade) {
      setError("Todos os campos são obrigatórios!");
      return;
    }

    try {
      await updateProduct(id, {
        nome: editForm.nome.trim(),
        descricao: editForm.descricao.trim(),
        valor: parseFloat(editForm.valor).toFixed(2),
        quantidade: parseInt(editForm.quantidade)
      });

      setSuccess("Produto atualizado com sucesso!");
      setEditingId(null);
      loadProducts();

      // Limpar mensagem após 3 segundos
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
        <h2><i className="bx bx-package"></i> Lista de Produtos</h2>
        <p>Gerencie seus produtos cadastrados</p>

        <div className="stats">
          <div className="stat-card">
            <i className="bx bx-box"></i>
            <span>Total: {products.length}</span>
          </div>
          <div className="stat-card">
            <i className="bx bx-dollar"></i>
            <span>Valor Total: R$ {
              products.reduce((total, p) => total + (parseFloat(p.valor) || 0) * (parseInt(p.quantidade) || 0), 0).toFixed(2)
            }</span>
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
          {products.map(product => (
            <div
              key={product._id}
              className={`product-card ${editingId === product._id ? 'editing' : ''}`}
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
                    <button
                      className="cancel-btn"
                      onClick={cancelEdit}
                    >
                      <i className="bx bx-x"></i>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="product-image">
                    {product.imagemUrl ? (
                      <img
                        src={product.imagemUrl}
                        alt={product.nome}
                        loading="lazy"
                      />
                    ) : (
                      <div className="no-image">
                        <i className="bx bx-image"></i>
                        <span>Sem imagem</span>
                      </div>
                    )}

                    {product.quantidade <= 0 && (
                      <span className="stock-badge out-of-stock">Esgotado</span>
                    )}
                  </div>

                  <div className="product-content">
                    <h3 className="product-title">{product.nome}</h3>
                    <p className="product-description">{product.descricao}</p>

                    <div className="product-details">
                      <div className="detail">
                        <span>R$ {parseFloat(product.valor || 0).toFixed(2)}</span>
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