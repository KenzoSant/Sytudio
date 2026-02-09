import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import "./AddProduct.css";

export default function AddProduct() {
  const { createProduct } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    valor: "",
    quantidade: "",
    imagem: []
  });

  const [preview, setPreview] = useState([]); 
  const [activePreview, setActivePreview] = useState(0);

   const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagem" && files) {
      const fileList = Array.from(files).slice(0, 3);
      setForm({ ...form, imagem: fileList });

      // preview múltiplo
      Promise.all(
        fileList.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            })
        )
      ).then((urls) => {
        setPreview(urls);
        setActivePreview(0);
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };


   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!form.nome || !form.descricao || !form.valor || !form.quantidade) {
      setError("Todos os campos são obrigatórios!");
      setIsLoading(false);
      return;
    }

    if (parseFloat(form.valor) <= 0 || parseInt(form.quantidade) < 0) {
      setError("Valor e quantidade devem ser números positivos!");
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("nome", form.nome.trim());
      data.append("descricao", form.descricao.trim());
      data.append("valor", parseFloat(form.valor).toFixed(2));
      data.append("quantidade", parseInt(form.quantidade));

      // agora envia até 3 imagens na mesma key "imagem"
      if (form.imagem && form.imagem.length > 0) {
        form.imagem.slice(0, 3).forEach((f) => data.append("imagem", f));
      }

      const res = await createProduct(data);

      if (res.ok) {
        setSuccess("Produto cadastrado com sucesso!");
        setForm({
          nome: "",
          descricao: "",
          valor: "",
          quantidade: "",
          imagem: []
        });
        setPreview([]);
        setActivePreview(0);
      } else {
        const err = await res.json();
        setError(err.error || "Erro ao cadastrar produto");
      }
    } catch (error) {
      setError(error.message || "Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

   const handleClearImage = () => {
    setForm({ ...form, imagem: [] });
    setPreview([]);
    setActivePreview(0);
  };

  return (
    <div className="add-product-container">

      <div className="form-header">
          <h2><i className="bx bx-plus-circle"></i> Adicionar Produto</h2>
          <p>Preencha os dados do novo produto</p>
        </div>
        
      <form className="add-product-form" onSubmit={handleSubmit}>
        

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

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nome">
              <i className="bx bx-purchase-tag"></i>
              Nome do Produto *
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Digite o nome do produto"
              value={form.nome}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="valor">
              <i className="bx bx-dollar"></i>
              Valor (R$) *
            </label>
            <input
              id="valor"
              name="valor"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={form.valor}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantidade">
              <i className="bx bx-box"></i>
              Quantidade em Estoque *
            </label>
            <input
              id="quantidade"
              name="quantidade"
              type="number"
              placeholder="0"
              min="0"
              value={form.quantidade}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="descricao">
              <i className="bx bx-text"></i>
              Descrição *
            </label>
            <textarea
              id="descricao"
              name="descricao"
              placeholder="Descreva o produto em detalhes..."
              value={form.descricao}
              onChange={handleChange}
              required
              disabled={isLoading}
              rows="4"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="imagem">
              <i className="bx bx-image-add"></i>
              Imagem do Produto
            </label>
            
            <div className="file-upload-container">
              <input
                id="imagem"
                name="imagem"
                type="file"
                accept="image/*"
                multiple
                onChange={handleChange}
                disabled={isLoading}
                className="file-input"
              />
              
               <label htmlFor="imagem" className="file-upload-label">
                <i className="bx bx-cloud-upload"></i>
                <span>Clique para selecionar até 3 imagens</span>
                <span className="file-info">PNG, JPG, WEBP (Max. 5MB)</span>
              </label>
              
              {preview.length > 0 && (
                <div className="image-preview">
                  <img src={preview[activePreview]} alt="Preview" />

                  {preview.length > 1 && (
                    <div className="image-dots">
                      {preview.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`dot ${idx === activePreview ? "active" : ""}`}
                          onClick={() => setActivePreview(idx)}
                          aria-label={`Imagem ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={handleClearImage}
                    disabled={isLoading}
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                </div>
              )}

              {form.imagem?.length > 0 && preview.length === 0 && (
                <div className="file-selected">
                  <i className="bx bx-check-circle"></i>
                  <span>{form.imagem.length} arquivo(s) selecionado(s)</span>
                </div>
              )}

            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="bx bx-loader-alt bx-spin"></i>
                Cadastrando...
              </>
            ) : (
              <>
                <i className="bx bx-save"></i>
                Salvar Produto
              </>
            )}
          </button>
          
           <button
            type="button"
            className="clear-btn"
            onClick={() => {
              setForm({
                nome: "",
                descricao: "",
                valor: "",
                quantidade: "",
                imagem: []
              });
              setPreview([]);
              setActivePreview(0);
              setError("");
              setSuccess("");
            }}
            disabled={isLoading}
          >
            <i className="bx bx-reset"></i>
            Limpar Formulário
          </button>
        </div>
      </form>
    </div>
  );
}