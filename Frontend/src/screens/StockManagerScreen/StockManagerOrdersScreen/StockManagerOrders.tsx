/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogOut, ChevronDown, Calendar, Package, X, Leaf } from 'lucide-react';
import { supplierOrdersStyles } from './StockManagerOrders.styles'; // podemos criar um styles próprio depois
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { orderService } from '../../../services/orderService';
import { productService } from '../../../services/productService';
import type { Order } from '../../../models/Order';
import { userService } from '../../../services/userService';

export default function StockManagerOrders() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Stock Manager";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'date' | 'product'>('date');
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'rejected'>('pending');
  const STATUS_LABELS: Record<'pending' | 'confirmed' | 'rejected', string> = {
    pending: 'Pendentes',
    confirmed: 'Confirmadas',
    rejected: 'Rejeitadas',
  };
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getAll(); // pega todas as encomendas

      const ordersWithDetails = await Promise.all(
        ordersData.map(async (order: Order) => {
          // Buscar produto
          let productName = 'Produto Desconhecido';
          try {
            const product = await productService.getProductById(order.productId);
            productName = product.name;
          } catch (error) {
            console.error(`Erro ao buscar produto ${order.productId}:`, error);
          }

          // Buscar fornecedor
          let supplierName = 'Fornecedor Desconhecido';
          try {
            const supplier = await userService.getUserById(order.userId);
            supplierName = supplier.name;
          } catch (error) {
            console.error(`Erro ao buscar fornecedor ${order.userId}:`, error);
          }

          return { ...order, productName, supplierName };
        })
      );

      setOrders(ordersWithDetails);
    } catch (error) {
      console.error("Erro ao carregar encomendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      await orderService.updateStatus(selectedOrder.id, 'rejected');
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'rejected' } : o));
      setShowCancelModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Erro ao cancelar encomenda:", error);
    }
  };

  const groupedOrdersByStatus = (status: 'pending' | 'confirmed' | 'rejected') => {
    const grouped: Record<string, Order[]> = {};
    const filteredOrders = orders.filter(o => o.status === status);

    if (filterType === 'date') {
      for (const order of filteredOrders) {
        const date = new Date(order.date).toLocaleDateString('pt-PT', {
          day: '2-digit', month: 'long', year: 'numeric'
        });
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(order);
      }
    } else {
      for (const order of filteredOrders) {
        const productName = order.productName || 'Produto Desconhecido';
        if (!grouped[productName]) grouped[productName] = [];
        grouped[productName].push(order);
      }
    }

    return grouped;
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={supplierOrdersStyles.pageContainer}>
      {/* Header */}
      <header style={supplierOrdersStyles.header}>
        <div style={supplierOrdersStyles.headerLeft}>
          <div style={supplierOrdersStyles.logoCircle()}>
            <Leaf size={supplierOrdersStyles.logoIcon()} color="#16a34a" />
          </div>
          <div style={supplierOrdersStyles.headerInfo}>
            <h1 style={supplierOrdersStyles.headerTitle}>Stock Manager</h1>
            <p style={supplierOrdersStyles.headerSubtitle}>Bem-vindo, {userName}</p>
          </div>
        </div>
        <div style={supplierOrdersStyles.headerActions}>
          <button style={supplierOrdersStyles.iconButton} onClick={handleLogout}>
            <LogOut size={supplierOrdersStyles.isMobile() ? 18 : 20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={supplierOrdersStyles.mainContent}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {['pending', 'confirmed', 'rejected'].map(tab => (
          <button
            key={tab}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: activeTab === tab ? '#16a34a' : '#fff',
              color: activeTab === tab ? '#fff' : '#1f2937',
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab(tab as 'pending' | 'confirmed' | 'rejected')}
          >
            {STATUS_LABELS[tab as 'pending' | 'confirmed' | 'rejected']}
          </button>
        ))}
      
        <div style={supplierOrdersStyles.filterContainer}>
          <button style={supplierOrdersStyles.filterButton} onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
            {filterType === 'date' ? <Calendar size={18} /> : <Package size={18} />}
            <span>Agrupar por {filterType === 'date' ? 'Data' : 'Produto'}</span>
            <ChevronDown size={18} />
          </button>
          {showFilterDropdown && (
            <div style={supplierOrdersStyles.filterDropdown}>
              <button
                style={{ ...supplierOrdersStyles.filterOption, ...(filterType === 'date' ? supplierOrdersStyles.filterOptionActive : {}) }}
                onClick={() => { setFilterType('date'); setShowFilterDropdown(false); }}
              >
                <Calendar size={16} /> Data de Entrega
              </button>
              <button
                style={{ ...supplierOrdersStyles.filterOption, ...(filterType === 'product' ? supplierOrdersStyles.filterOptionActive : {}) }}
                onClick={() => { setFilterType('product'); setShowFilterDropdown(false); }}
              >
                <Package size={16} /> Produto
              </button>
            </div>
          )}
        </div>
        </div>
        {loading ? (
          <div style={supplierOrdersStyles.loadingContainer}>A carregar encomendas...</div>
        ) : (
          Object.entries(groupedOrdersByStatus(activeTab)).map(([key, groupOrders]) => (
            <div key={key} style={supplierOrdersStyles.groupCard}>
              <div style={supplierOrdersStyles.groupHeader}>
                <h4 style={supplierOrdersStyles.groupTitle}>{key}</h4>
                <span style={supplierOrdersStyles.groupBadge}>{groupOrders.length} encomendas</span>
              </div>

              {groupOrders.map(order => (
                <div key={order.id} style={supplierOrdersStyles.orderCard}>
                  <div style={supplierOrdersStyles.orderHeader}>
                  <div>
                    <p style={supplierOrdersStyles.orderProduct}>{order.productName}</p>
                    <p style={supplierOrdersStyles.orderDetails}>
                      Fornecedor: {order.supplierName}
                    </p>
                    <p style={supplierOrdersStyles.orderDetails}>
                      Quantidade: {order.quantity} {order.unit}
                    </p>
                  </div>
                  {activeTab === 'pending' && (
                    <button
                      style={supplierOrdersStyles.rejectButton}
                      onClick={() => { setSelectedOrder(order); setShowCancelModal(true); }}
                    >
                      <X size={16} /> Cancelar
                    </button>
                  )}
                </div>
                  <div style={supplierOrdersStyles.orderFooter}>
                    <p style={supplierOrdersStyles.orderDate}>
                      Entrega: {new Date(order.date).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

      </main>

      {/* Cancel Modal */}
      {showCancelModal && selectedOrder && (
        <div style={supplierOrdersStyles.modalOverlay} onClick={() => setShowCancelModal(false)}>
          <div style={supplierOrdersStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={supplierOrdersStyles.modalHeader}>
              <h3 style={supplierOrdersStyles.modalTitle}>Cancelar Encomenda</h3>
              <button style={supplierOrdersStyles.modalCloseButton} onClick={() => setShowCancelModal(false)}><X size={20} /></button>
            </div>
            <div style={supplierOrdersStyles.modalBody}>
              <p style={supplierOrdersStyles.modalText}>Tem certeza que deseja cancelar esta encomenda?</p>
              <p style={supplierOrdersStyles.modalSubtext}>
                Quantidade: {selectedOrder.quantity} {selectedOrder.unit}
              </p>
            </div>
            <div style={supplierOrdersStyles.modalFooter}>
              <button style={supplierOrdersStyles.cancelButton} onClick={() => setShowCancelModal(false)}>Cancelar</button>
              <button style={supplierOrdersStyles.confirmRejectButton} onClick={handleCancelOrder}>Sim, Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
