import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import "./Dashboard.css";

export default function Dashboard() {

  const { 
    deliveries, 
    addDelivery, 
    updateDelivery,
    deleteDelivery,
    formatDateForDisplay 
  } = useAdmin();

  const [editingId, setEditingId] = useState(null);
  const [collapsedCards, setCollapsedCards] = useState({});
  const [deletingCard, setDeletingCard] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "", show: false });
  const [confirmDelete, setConfirmDelete] = useState(null); // Para modal de confirmação

  const [form, setForm] = useState({
    cliente: "",
    figure: "",
    valorVenda: "",
    valorGasto: "",
    dataEntrega: ""
  });

  // Função para mostrar mensagem personalizada
  const showMessage = (text, type = "info") => {
    setMessage({ text, type, show: true });
    setTimeout(() => {
      setMessage({ text: "", type: "", show: false });
    }, 3000);
  };

  // Função para marcar entrega como entregue com animação
  const handleMarkAsDelivered = async (id) => {
    const delivery = deliveries.find(d => d._id === id);
    setCollapsedCards(prev => ({
      ...prev,
      [id]: true
    }));
    
    setTimeout(async () => {
      try {
        await updateDelivery(id, { status: "entregue" });
        showMessage(`Entrega de ${delivery.figure} para ${delivery.cliente} marcada como entregue!`, "success");
      } catch (error) {
        showMessage("Erro ao marcar como entregue", "error");
      }
    }, 500);
  };

  // Função para cancelar/remover pedido com animação
  const handleCancelDelivery = async (id) => {
    const delivery = deliveries.find(d => d._id === id);
    
    // Marca o card para animação de exclusão
    setDeletingCard(id);
    
    // Espera a animação de desaparecimento
    setTimeout(async () => {
      try {
        await deleteDelivery(id);
        setDeletingCard(null);
        showMessage(`Pedido de ${delivery.figure} para ${delivery.cliente} removido com sucesso!`, "success");
      } catch (error) {
        showMessage("Erro ao remover pedido", "error");
      }
    }, 500);
  };

  // Função para mostrar modal de confirmação
  const showConfirmDelete = (delivery) => {
    setConfirmDelete(delivery);
  };

  // Função para executar a exclusão após confirmação
  const executeDelete = async () => {
    if (confirmDelete) {
      await handleCancelDelivery(confirmDelete._id);
      setConfirmDelete(null);
    }
  };

  // Função para cancelar a exclusão
  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  // Função para expandir um card que está encolhido
  const toggleCard = (id) => {
    setCollapsedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const submitDelivery = () => {
    if (!form.cliente || !form.figure || !form.valorVenda || !form.valorGasto || !form.dataEntrega) {
      showMessage("Preencha todos os campos!", "error");
      return;
    }

    if (editingId) {
      updateDelivery(editingId, form);
      setEditingId(null);
      showMessage("Entrega atualizada com sucesso!", "success");
    } else {
      addDelivery({
        ...form,
        status: "agendada"
      });
      showMessage("Entrega adicionada com sucesso!", "success");
    }

    setForm({
      cliente: "",
      figure: "",
      valorVenda: "",
      valorGasto: "",
      dataEntrega: ""
    });
  };

  const startEdit = (d) => {
    setEditingId(d._id);
    setForm({
      cliente: d.cliente,
      figure: d.figure,
      valorVenda: d.valorVenda,
      valorGasto: d.valorGasto,
      dataEntrega: d.dataEntrega
    });
  };

  const getMonthFromDate = (dateString) => {
    if (!dateString) return -1;
    
    try {
      const date = new Date(dateString);
      const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      return adjustedDate.getMonth();
    } catch (error) {
      console.error("Erro ao extrair mês:", error);
      return -1;
    }
  };

  // Filtrar entregas
  const entregasAgendadas = deliveries.filter(d => d.status !== "entregue");
  const entregasEntregues = deliveries.filter(d => d.status === "entregue");
  const mesAtual = new Date().getMonth();
  const entregasMes = deliveries.filter(d => getMonthFromDate(d.dataEntrega) === mesAtual);

  const totalGanho = entregasEntregues.reduce(
    (a, b) => a + (Number(b.valorVenda || 0) - Number(b.valorGasto || 0)),
    0
  );

  const totalGasto = entregasEntregues.reduce((a, b) => a + Number(b.valorGasto || 0), 0);

  return (
    <div className="dashboard-container">

      {/* Mensagem de notificação */}
      {message.show && (
        <div className={`dashboard-message message-${message.type}`}>
          <div className="message-content">
            <i className={`bx ${
              message.type === 'success' ? 'bx-check-circle' : 
              message.type === 'error' ? 'bx-error-circle' : 
              'bx-info-circle'
            }`}></i>
            <span>{message.text}</span>
          </div>
          <button className="message-close" onClick={() => setMessage({ text: "", type: "", show: false })}>
            <i className='bx bx-x'></i>
          </button>
        </div>
      )}

      {/* Modal de confirmação para exclusão */}
      {confirmDelete && (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja cancelar e remover o pedido de <strong>{confirmDelete.cliente}</strong> ({confirmDelete.figure})?</p>
            <p className="modal-warning">Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={cancelDelete}>
                <i className='bx bx-x'></i> Cancelar
              </button>
              <button className="btn-confirm" onClick={executeDelete}>
                <i className='bx bx-trash'></i> Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <h1><i className='bx bxs-palette'></i> Sytudio Figures - Dashboard</h1>
        <p>Gerencie suas encomendas, produções e entregas</p>
      </div>

      <div className="dashboard-cards">
        <Card title="Entregas Realizadas" value={entregasEntregues.length} icon="bx bxs-check-circle" />
        <Card title="Entregas do Mês" value={entregasMes.length} icon="bx bxs-calendar-check" />
        <Card title="Total Ganho" value={`R$ ${totalGanho.toFixed(2)}`} icon="bx bxs-wallet" />
        <Card title="Total Gasto" value={`R$ ${totalGasto.toFixed(2)}`} icon="bx bxs-credit-card" />
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">
          <i className='bx bxs-calendar'></i> Agenda de Entregas
        </h2>

        <div className="dashboard-grid-2col">
          {/* FORM */}
          <div className="form-container">
            <h3>{editingId ? "Editar Entrega" : "Adicionar Nova Entrega"}</h3>

            <input className="dashboard-input" placeholder="Cliente"
              value={form.cliente}
              onChange={e => setForm({ ...form, cliente: e.target.value })}
            />

            <input className="dashboard-input" placeholder="Action Figure"
              value={form.figure}
              onChange={e => setForm({ ...form, figure: e.target.value })}
            />

            <input className="dashboard-input" placeholder="Valor de Venda"
              type="number"
              value={form.valorVenda}
              onChange={e => setForm({ ...form, valorVenda: e.target.value })}
            />

            <input className="dashboard-input" placeholder="Valor Gasto"
              type="number"
              value={form.valorGasto}
              onChange={e => setForm({ ...form, valorGasto: e.target.value })}
            />

            <input className="dashboard-input" type="date"
              value={form.dataEntrega}
              onChange={e => setForm({ ...form, dataEntrega: e.target.value })}
            />

            <button className="dashboard-btn" onClick={submitDelivery}>
              {editingId ? "Salvar Alterações" : "Adicionar Entrega"}
            </button>
          </div>

          {/* LISTA DE ENTREGAS AGENDADAS */}
          <div className="deliveries-container">
            <h3>Entregas Agendadas</h3>

            {entregasAgendadas.length === 0 ? (
              <p className="no-deliveries">Nenhuma entrega agendada no momento.</p>
            ) : (
              entregasAgendadas.map(d => (
                <DeliveryCard 
                  key={d._id} 
                  delivery={d} 
                  updateDelivery={updateDelivery}
                  deleteDelivery={handleCancelDelivery}
                  startEdit={startEdit}
                  formatDateForDisplay={formatDateForDisplay}
                  isCollapsed={collapsedCards[d._id]}
                  isDeleting={deletingCard === d._id}
                  onMarkAsDelivered={() => handleMarkAsDelivered(d._id)}
                  onToggleCard={() => toggleCard(d._id)}
                  onConfirmDelete={showConfirmDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* SEÇÃO DE ENTREGAS REALIZADAS */}
      <div className="dashboard-section">
        <h2 className="section-title">
          <i className='bx bxs-check-circle'></i> Entregas Realizadas
        </h2>

        <div className="deliveries-container">
          {entregasEntregues.length === 0 ? (
            <p className="no-deliveries">Nenhuma entrega realizada ainda.</p>
          ) : (
            entregasEntregues.map(d => (
              <DeliveryCard 
                key={d._id} 
                delivery={d} 
                updateDelivery={updateDelivery}
                deleteDelivery={handleCancelDelivery}
                startEdit={startEdit}
                formatDateForDisplay={formatDateForDisplay}
                isCollapsed={collapsedCards[d._id]}
                isDeleting={deletingCard === d._id}
                onToggleCard={() => toggleCard(d._id)}
                onConfirmDelete={showConfirmDelete}
                isDelivered={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="dashboard-card">
      <i className={icon}></i>
      <h3>{title}</h3>
      <p className="dashboard-card-value">{value}</p>
    </div>
  );
}

function DeliveryCard({ 
  delivery, 
  updateDelivery,
  deleteDelivery,
  startEdit, 
  formatDateForDisplay,
  isCollapsed,
  isDeleting,
  onMarkAsDelivered,
  onToggleCard,
  onConfirmDelete,
  isDelivered = false
}) {
  if (isDeleting) {
    return (
      <div className="delivery-card delivery-card-deleting">
        <div className="deleting-content">
          <i className='bx bx-trash'></i>
          <span>Removendo pedido...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`delivery-card ${isDelivered ? 'delivery-card-delivered' : ''} ${isCollapsed ? 'delivery-card-collapsed' : ''}`}>
      <div className="delivery-card-header" onClick={onToggleCard} style={{cursor: 'pointer'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <b>{delivery.figure}</b>
          <i className={`bx ${isCollapsed ? 'bx-chevron-down' : 'bx-chevron-up'}`}></i>
        </div>
        {isCollapsed && (
          <div className="delivery-card-summary">
            <small>
              Cliente: {delivery.cliente} | 
              Status: <span className={`status-${delivery.status}`}>{delivery.status}</span> | 
              Data: {formatDateForDisplay(delivery.dataEntrega)}
            </small>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="delivery-card-content">
          <div><strong>Cliente:</strong> {delivery.cliente}</div>
          <div><strong>Venda:</strong> R$ {delivery.valorVenda}</div>
          <div><strong>Gasto:</strong> R$ {delivery.valorGasto}</div>
          <div><strong>Data:</strong> <b>{formatDateForDisplay(delivery.dataEntrega)}</b></div>
          <div>
            <strong>Status:</strong> 
            <span className={`status-badge status-${delivery.status}`}>
              {delivery.status}
            </span>
          </div>

          {!isDelivered && (
            <div className="delivery-actions">
              <button className="btn-entregue" onClick={onMarkAsDelivered}>
                <i className='bx bx-check'></i> Marcar como Entregue
              </button>

              <button className="btn-cancelar" onClick={() => onConfirmDelete(delivery)}>
                <i className='bx bx-trash'></i> Cancelar e Remover
              </button>

              <button className="btn-editar" onClick={() => startEdit(delivery)}>
                <i className='bx bx-edit'></i> Editar
              </button>
            </div>
          )}

          {isDelivered && (
            <div className="delivery-actions">
              <span className="delivered-label">
                <i className='bx bx-check-circle'></i> Entregue
              </span>
              <button className="btn-cancelar" onClick={() => onConfirmDelete(delivery)}>
                <i className='bx bx-trash'></i> Remover
              </button>
              <button className="btn-editar" onClick={() => startEdit(delivery)}>
                <i className='bx bx-edit'></i> Editar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}