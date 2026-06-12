import { useLogout } from "../../../util/useLogout";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, LogOut, ChevronDown, Calendar, Package, X, Check } from 'lucide-react';
import { supplierOrdersStyles } from './SupplierOrders.styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { orderService } from '../../../services/orderService';
import { productService } from '../../../services/productService';
import type { Order } from '../../../models/Order';
import { API_BASE_URL } from '../../../../config';
import axios from 'axios';
import type { Institution } from '../../../models/Institution';

export default function SupplierOrders() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Maria Santos";
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'date' | 'product'>('date');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
  const [groupByLocation, setGroupByLocation] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [user.id]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getByUserId(user.id);
      
      // Fetch product names for each order
      const ordersWithProducts = await Promise.all(
        ordersData.map(async (order: Order) => {
          try {
            const canteenResponse = await axios.get(`${API_BASE_URL}/canteens/${order.canteenId}`);
            const canteen = canteenResponse.data;
            const institutionResponse = await axios.get(`${API_BASE_URL}/institutions/${canteen.institutionId}`);
            const institution = institutionResponse.data as Institution;
            const address = `${institution.name}, ${institution.location}, ${institution.freguesia}, ${institution.municipio}`;
            const product = await productService.getProductById(order.productId);
            return { ...order, productName: product.name, address: address };
          } catch (error) {
            console.error(`Erro ao buscar produto ${order.productId}:`, error);
            return { ...order, productName: 'Produto Desconhecido' };
          }
        })
      );
      
      setOrders(ordersWithProducts);
    } catch (error) {
      console.error("Erro ao carregar encomendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      await orderService.updateStatus(selectedOrder.id, 'rejected');
      setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      setShowRejectModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Erro ao recusar encomenda:", error);
    }
  };

  const handleLogout = useLogout();

  const groupedOrders = () => {
    const grouped: Record<string, Order[]> = {};
    const filteredOrders = orders.filter(o => o.status === activeTab);

    // Função para chave secundária (data ou produto)
    const getSecondaryKey = (order: Order) => {
      if (filterType === 'date') {
        return new Date(order.date).toLocaleDateString('pt-PT', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
      } else {
        return order.productName || 'Produto Desconhecido';
      }
    };

    if (groupByLocation) {
      // Primeiro por morada
      for (const order of filteredOrders) {
        const address = order.address || 'Morada Desconhecida';
        if (!grouped[address]) grouped[address] = [];
        grouped[address].push(order);
      }

      // Depois aplicar critério secundário dentro de cada morada
      const finalGrouped: Record<string, Order[]> = {};
      for (const address in grouped) {
        const subGroup: Record<string, Order[]> = {};
        for (const order of grouped[address]) {
          const key = getSecondaryKey(order);
          if (!subGroup[key]) subGroup[key] = [];
          subGroup[key].push(order);
        }

        // Achatar subgrupo para manter compatibilidade com UI
        for (const subKey in subGroup) {
          finalGrouped[`${address} - ${subKey}`] = subGroup[subKey];
        }
      }
      return finalGrouped;
    } else {
      // Agrupar só pelo critério do dropdown
      for (const order of filteredOrders) {
        const key = getSecondaryKey(order);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(order);
      }
      return grouped;
    }
  };



  const pendingOrders = orders.filter(o => o.status === 'pending');
  const confirmedOrders = orders.filter(o => o.status === 'confirmed');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  return (
    <div style={supplierOrdersStyles.pageContainer}>
      {/* Header */}
      <header style={supplierOrdersStyles.header}>
        <div style={supplierOrdersStyles.headerLeft}>
          <div style={supplierOrdersStyles.logoCircle()}>
            <span style={supplierOrdersStyles.logoText}>BC</span>
          </div>
          <div style={supplierOrdersStyles.headerInfo}>
            <h1 style={supplierOrdersStyles.headerTitle}>BioCantinas</h1>
            <p style={supplierOrdersStyles.headerSubtitle}>Bem-vindo, {userName}</p>
          </div>
        </div>
        <div style={supplierOrdersStyles.headerActions}>
          <button
            style={supplierOrdersStyles.iconButton}
            onClick={handleLogout}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'}
          >
            <LogOut size={supplierOrdersStyles.isMobile() ? 18 : 20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={supplierOrdersStyles.mainContent}>
        {/* Page Header */}
        <div style={supplierOrdersStyles.pageHeader}>
          <div>
            <h2 style={supplierOrdersStyles.pageTitle}>Encomendas</h2>
          </div>
          
          <div style={supplierOrdersStyles.filterContainer}>
            <button
              style={{
                ...supplierOrdersStyles.filterButton,
                marginLeft: 8,
                backgroundColor: groupByLocation ? '#3b82f6' : '#f3f4f6',
                color: groupByLocation ? '#fff' : '#000',
              }}
              onClick={() => setGroupByLocation(prev => !prev)}
            >
              Agrupar por Morada
            </button>
            <button
              style={supplierOrdersStyles.filterButton}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              {filterType === 'date' ? <Calendar size={18} /> : <Package size={18} />}
              <span>Agrupar por {filterType === 'date' ? 'Data' : 'Produto'}</span>
              <ChevronDown size={18} />
            </button>
            
            {showFilterDropdown && (
              <div style={supplierOrdersStyles.filterDropdown}>
                <button
                  style={{...supplierOrdersStyles.filterOption, ...(filterType === 'date' ? supplierOrdersStyles.filterOptionActive : {})}}
                  onClick={() => {
                    setFilterType('date');
                    setShowFilterDropdown(false);
                  }}
                >
                  <Calendar size={16} />
                  Data de Entrega
                </button>
                <button
                  style={{...supplierOrdersStyles.filterOption, ...(filterType === 'product' ? supplierOrdersStyles.filterOptionActive : {})}}
                  onClick={() => {
                    setFilterType('product');
                    setShowFilterDropdown(false);
                  }}
                >
                  <Package size={16} />
                  Produto
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={supplierOrdersStyles.tabsContainer}>
          <button
            style={{
              ...supplierOrdersStyles.tabButton,
              ...(activeTab === 'pending' ? supplierOrdersStyles.tabButtonActive : {})
            }}
            onClick={() => setActiveTab('pending')}
          >
            Provisórias
          </button>

          <button
            style={{
              ...supplierOrdersStyles.tabButton,
              ...(activeTab === 'confirmed' ? supplierOrdersStyles.tabButtonActive : {})
            }}
            onClick={() => setActiveTab('confirmed')}
          >
            Confirmadas
          </button>

          <button
            style={{
              ...supplierOrdersStyles.tabButton,
              ...(activeTab === 'cancelled' ? supplierOrdersStyles.tabButtonActive : {})
            }}
            onClick={() => setActiveTab('cancelled')}
          >
            Canceladas
          </button>
        </div>

        {/* Pending Orders Warning */}
        {activeTab === 'pending' && pendingOrders.length > 0 && (
          <div style={supplierOrdersStyles.warningCard}>
            <Bell size={20} color="#f59e0b" />
            <div>
              <p style={supplierOrdersStyles.warningTitle}>Encomendas Provisórias</p>
              <p style={supplierOrdersStyles.warningText}>
                As encomendas provisórias poderão ser alteradas futuramente e quando forem confirmadas pelo sistema, passarão para encomendas confirmadas.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div style={supplierOrdersStyles.loadingContainer}>
            <p>A carregar encomendas...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={supplierOrdersStyles.emptyState}>
            <Package size={48} color="#d1d5db" />
            <p style={supplierOrdersStyles.emptyTitle}>Sem encomendas</p>
            <p style={supplierOrdersStyles.emptyText}>Ainda não tem encomendas registadas.</p>
          </div>
        ) : (
          <>
            {/* Pending Orders Section */}
            {activeTab === 'pending' && pendingOrders.length >= 0 && (
              <div style={supplierOrdersStyles.section}>
                <h3 style={supplierOrdersStyles.sectionTitle}>Provisórias </h3>
                {Object.entries(groupedOrders()).map(([key, groupOrders]) => {
                // Filtrar de acordo com o status
                const pendingInGroup = groupOrders.filter(o => o.status === 'pending');
                if (pendingInGroup.length === 0) return null;

                // Calcular total apenas se estiver a agrupar por produto
                const totalQuantity = filterType === 'product'
                  ? groupOrders.reduce((sum, o) => sum + o.quantity, 0)
                  : null;

                const totalQuantityFormatted = totalQuantity !== null
                  ? totalQuantity.toFixed(2)
                  : null;
                
                return (
                  <div key={key} style={supplierOrdersStyles.groupCard}>
                    <div style={supplierOrdersStyles.groupHeader}>
                      <h4 style={supplierOrdersStyles.groupTitle}>
                        {key} {totalQuantityFormatted !== null ? `(Total: ${totalQuantityFormatted})` : ''}
                      </h4>
                      <span style={supplierOrdersStyles.groupBadge}>
                        {pendingInGroup.length} {pendingInGroup.length === 1 ? 'encomenda' : 'encomendas'}
                      </span>
                    </div>
                    
                    {pendingInGroup.map(order => (
                      <div key={order.id} style={supplierOrdersStyles.orderCard}>
                        <div style={supplierOrdersStyles.orderHeader}>
                          <div>
                            <p style={supplierOrdersStyles.orderProduct}>{order.productName}</p>
                            <p style={supplierOrdersStyles.orderDetails}>
                              Quantidade: {order.quantity} {order.unit}
                            </p>
                          </div>
                          <span style={{...supplierOrdersStyles.statusBadge, ...supplierOrdersStyles.statusPending}}>
                            Provisória
                          </span>
                        </div>
                        <p style={supplierOrdersStyles.orderDate}>
                            Morada: {order.address}
                          </p>
                        <div style={supplierOrdersStyles.orderFooter}>
                          <p style={supplierOrdersStyles.orderDate}>
                            Entrega: {new Date(order.date).toLocaleDateString('pt-PT')}
                          </p>
                          <button
                            style={supplierOrdersStyles.rejectButton}
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowRejectModal(true);
                            }}
                            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#dc2626'}
                            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ef4444'}
                          >
                            <X size={16} />
                            Recusar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              </div>
            )}

            {/* Confirmed Orders Section */}
            {activeTab === 'confirmed' && confirmedOrders.length >= 0 && (
              <div style={supplierOrdersStyles.section}>
                <h3 style={supplierOrdersStyles.sectionTitle}>Confirmadas</h3>
                {Object.entries(groupedOrders()).map(([key, groupOrders]) => {
                  const confirmedInGroup = groupOrders.filter(o => o.status === 'confirmed');
                  if (confirmedInGroup.length === 0) return null;
                  
                  return (
                    <div key={key} style={supplierOrdersStyles.groupCard}>
                      <div style={supplierOrdersStyles.groupHeader}>
                        <h4 style={supplierOrdersStyles.groupTitle}>{key}</h4>
                        <span style={supplierOrdersStyles.groupBadge}>
                          {confirmedInGroup.length} {confirmedInGroup.length === 1 ? 'encomenda' : 'encomendas'}
                        </span>
                      </div>
                      
                      {confirmedInGroup.map(order => (
                        <div key={order.id} style={supplierOrdersStyles.orderCard}>
                          <div style={supplierOrdersStyles.orderHeader}>
                            <div>
                              <p style={supplierOrdersStyles.orderProduct}>{order.productName}</p>
                              <p style={supplierOrdersStyles.orderDetails}>
                                Quantidade: {order.quantity} {order.unit}
                              </p>
                            </div>
                            <span style={{...supplierOrdersStyles.statusBadge, ...supplierOrdersStyles.statusConfirmed}}>
                              <Check size={14} />
                              Confirmada
                            </span>
                          </div>
                          
                          <div style={supplierOrdersStyles.orderFooter}>
                            <p style={supplierOrdersStyles.orderDate}>
                              Entrega: {new Date(order.date).toLocaleDateString('pt-PT')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'cancelled' && cancelledOrders.length >= 0 && (
        <div style={supplierOrdersStyles.section}>
          <h3 style={supplierOrdersStyles.sectionTitle}>Canceladas</h3>

          {Object.entries(groupedOrders()).map(([key, groupOrders]) => {
            const cancelledInGroup = groupOrders.filter(o => o.status === 'cancelled');
            if (cancelledInGroup.length === 0) return null;

            return (
              <div key={key} style={supplierOrdersStyles.groupCard}>
                <div style={supplierOrdersStyles.groupHeader}>
                  <h4 style={supplierOrdersStyles.groupTitle}>{key}</h4>
                  <span style={supplierOrdersStyles.groupBadge}>
                    {cancelledInGroup.length} {cancelledInGroup.length === 1 ? 'encomenda' : 'encomendas'}
                  </span>
                </div>

                {cancelledInGroup.map(order => (
                  <div key={order.id} style={supplierOrdersStyles.orderCard}>
                    <div style={supplierOrdersStyles.orderHeader}>
                      <div>
                        <p style={supplierOrdersStyles.orderProduct}>{order.productName}</p>
                        <p style={supplierOrdersStyles.orderDetails}>
                          Quantidade: {order.quantity} {order.unit}
                        </p>
                      </div>
                      <span style={{...supplierOrdersStyles.statusBadge, backgroundColor: '#9ca3af', color: '#fff'}}>
                        Cancelada
                      </span>
                    </div>

                    <p style={supplierOrdersStyles.orderDate}>
                      Morada: {order.address}
                    </p>

                    <div style={supplierOrdersStyles.orderFooter}>
                      <p style={supplierOrdersStyles.orderDate}>
                        Entrega: {new Date(order.date).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
      </main>

      {/* Reject Confirmation Modal */}
      {showRejectModal && selectedOrder && (
        <div style={supplierOrdersStyles.modalOverlay} onClick={() => setShowRejectModal(false)}>
          <div style={supplierOrdersStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={supplierOrdersStyles.modalHeader}>
              <h3 style={supplierOrdersStyles.modalTitle}>Recusar Encomenda</h3>
              <button
                style={supplierOrdersStyles.modalCloseButton}
                onClick={() => setShowRejectModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={supplierOrdersStyles.modalBody}>
              <p style={supplierOrdersStyles.modalText}>
                Tem certeza que deseja recusar a encomenda?
              </p>
              <p style={supplierOrdersStyles.modalSubtext}>
                Quantidade: {selectedOrder.quantity} {selectedOrder.unit}
              </p>
            </div>
            
            <div style={supplierOrdersStyles.modalFooter}>
              <button
                style={supplierOrdersStyles.cancelButton}
                onClick={() => setShowRejectModal(false)}
                onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fff'}
              >
                Cancelar
              </button>
              <button
                style={supplierOrdersStyles.confirmRejectButton}
                onClick={handleRejectOrder}
                onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ef4444'}
              >
                Sim, Recusar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}