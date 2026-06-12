import { useLogout } from "../../../util/useLogout";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Bell, LogOut, ArrowLeft, Package } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const producerStatisticsStyles = {
  pageContainer: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    margin: 0,
    padding: 0,
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,

  header: {
    backgroundColor: '#16a34a',
    color: 'white',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  } as React.CSSProperties,

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,

  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,

  logoCircle: {
    width: '40px',
    height: '40px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as React.CSSProperties,

  logoText: {
    color: '#16a34a',
    fontWeight: 700,
    fontSize: '20px',
  } as React.CSSProperties,

  headerInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
  } as React.CSSProperties,

  headerTitle: {
    fontWeight: 700,
    fontSize: '18px',
    marginBottom: '2px',
    margin: 0,
    color: 'white',
  } as React.CSSProperties,

  headerSubtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: 0,
  } as React.CSSProperties,

  headerActions: {
    display: 'flex',
    gap: '8px',
  } as React.CSSProperties,

  iconButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

  mainContent: {
    flex: 1,
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '48px 24px',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,

  titleSection: {
    marginBottom: '32px',
  } as React.CSSProperties,

  pageTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 8px 0',
  } as React.CSSProperties,

  pageDescription: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '8px 0 0 0',
  } as React.CSSProperties,

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  } as React.CSSProperties,

  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  } as React.CSSProperties,

  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
  } as React.CSSProperties,

  statValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#111827',
  } as React.CSSProperties,

  chartCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  } as React.CSSProperties,

  chartTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '24px',
  } as React.CSSProperties,

  placeholderBox: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '48px',
    textAlign: 'center' as const,
    color: '#6b7280',
    fontSize: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
};

const COLORS = {
  approved: '#16a34a',
  submitted: '#f59e0b',
  under_review: '#3b82f6',
  rejected: '#ef4444',
  cancelled: '#6b7280',
};

export default function NetworkProducerStatisticsScreen() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/producer-statistics`);
      setStatistics(response.data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/network-dashboard");
  };

  const handleLogout = useLogout();


  return (
    <div style={producerStatisticsStyles.pageContainer}>
      {/* Header */}
      <header style={producerStatisticsStyles.header}>
        <div style={producerStatisticsStyles.headerLeft}>
          <button
            style={producerStatisticsStyles.backButton}
            onClick={handleBack}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={producerStatisticsStyles.logoCircle}>
            <span style={producerStatisticsStyles.logoText}>B</span>
          </div>
          <div style={producerStatisticsStyles.headerInfo}>
            <h1 style={producerStatisticsStyles.headerTitle}>BioCantinas</h1>
            <p style={producerStatisticsStyles.headerSubtitle}>
              Bem-vindo, {user?.name || "Utilizador"}
            </p>
          </div>
        </div>
        <div style={producerStatisticsStyles.headerActions}>
          <button
            style={producerStatisticsStyles.iconButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell size={20} />
          </button>
          <button
            style={producerStatisticsStyles.iconButton}
            onClick={handleLogout}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={producerStatisticsStyles.mainContent}>
        <div style={producerStatisticsStyles.titleSection}>
          <h2 style={producerStatisticsStyles.pageTitle}>Estatísticas dos Produtores</h2>
          <p style={producerStatisticsStyles.pageDescription}>
            Visualize os KPIs dos produtores e encomendas, incluindo encomendas por cantina e distribuição por status.
          </p>
        </div>

        {loading ? (
          <div style={producerStatisticsStyles.placeholderBox}>
            A carregar estatísticas...
          </div>
        ) : statistics ? (
          <>
            {/* Cards de Visão Geral - Orders */}
            <div style={producerStatisticsStyles.statsGrid}>
              <div style={producerStatisticsStyles.statCard}>
                <div style={producerStatisticsStyles.statLabel}>Total de Encomendas</div>
                <div style={producerStatisticsStyles.statValue}>{statistics.totalOrders || 0}</div>
              </div>
              <div style={producerStatisticsStyles.statCard}>
                <div style={producerStatisticsStyles.statLabel}>Cantinas com Encomendas</div>
                <div style={producerStatisticsStyles.statValue}>{statistics.ordersByCanteen?.length || 0}</div>
              </div>
              <div style={producerStatisticsStyles.statCard}>
                <div style={producerStatisticsStyles.statLabel}>Encomendas Entregues</div>
                <div style={producerStatisticsStyles.statValue}>
                  {statistics.ordersByCanteen?.reduce((sum: number, c: any) => sum + (c.ordersByStatus?.delivered || 0), 0) || 0}
                </div>
              </div>
              <div style={producerStatisticsStyles.statCard}>
                <div style={producerStatisticsStyles.statLabel}>Encomendas Pendentes</div>
                <div style={producerStatisticsStyles.statValue}>
                  {statistics.ordersByCanteen?.reduce((sum: number, c: any) => sum + (c.ordersByStatus?.pending || 0), 0) || 0}
                </div>
              </div>
            </div>

            {/* Orders por Cantina */}
            <div style={producerStatisticsStyles.chartCard}>
              <h3 style={producerStatisticsStyles.chartTitle}>Encomendas por Cantina</h3>
              {statistics.ordersByCanteen && statistics.ordersByCanteen.length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}>
                  {statistics.ordersByCanteen.map((canteen: any) => (
                    <div key={canteen.canteenId} style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid #e5e7eb',
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                      }}>
                        <div style={{
                          fontWeight: 700,
                          color: '#111827',
                          fontSize: '18px',
                        }}>
                          {canteen.canteenName}
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '4px',
                        }}>
                          {canteen.lastDeliveryDate && (
                            <div style={{
                              fontSize: '12px',
                              color: '#16a34a',
                              fontWeight: 500,
                            }}>
                              Entregue: {new Date(canteen.lastDeliveryDate).toLocaleDateString("pt-PT", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </div>
                          )}
                          {canteen.lastPendingDate && (
                            <div style={{
                              fontSize: '12px',
                              color: '#f59e0b',
                              fontWeight: 500,
                            }}>
                              Pendente: {new Date(canteen.lastPendingDate).toLocaleDateString("pt-PT", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>Total de Encomendas:</span>
                          <span style={{ fontWeight: 600, color: '#111827', fontSize: '16px' }}>
                            {canteen.totalOrders}
                          </span>
                        </div>
                        {canteen.quantitiesByUnit && canteen.quantitiesByUnit.length > 0 && (
                          <div style={{
                            marginTop: '8px',
                            padding: '12px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                          }}>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 600 }}>
                              Quantidades por Unidade:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {canteen.quantitiesByUnit.map((qty: any, idx: number) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                  <span style={{ color: '#6b7280' }}>{qty.unit}:</span>
                                  <span style={{ fontWeight: 600, color: '#111827' }}>{qty.totalQuantity.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div style={{
                          marginTop: '8px',
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '8px',
                        }}>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 600 }}>
                            Por Status:
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                              <span style={{ color: '#6b7280' }}>Pendentes:</span>
                              <span style={{ fontWeight: 600, color: '#f59e0b' }}>{canteen.ordersByStatus?.pending || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                              <span style={{ color: '#6b7280' }}>Enviadas:</span>
                              <span style={{ fontWeight: 600, color: '#3b82f6' }}>{canteen.ordersByStatus?.sent || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                              <span style={{ color: '#6b7280' }}>Confirmadas:</span>
                              <span style={{ fontWeight: 600, color: '#10b981' }}>{canteen.ordersByStatus?.confirmed || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                              <span style={{ color: '#6b7280' }}>Entregues:</span>
                              <span style={{ fontWeight: 600, color: '#16a34a' }}>{canteen.ordersByStatus?.delivered || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                              <span style={{ color: '#6b7280' }}>Rejeitadas:</span>
                              <span style={{ fontWeight: 600, color: '#ef4444' }}>{canteen.ordersByStatus?.rejected || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                              <span style={{ color: '#6b7280' }}>Canceladas:</span>
                              <span style={{ fontWeight: 600, color: '#6b7280' }}>{canteen.ordersByStatus?.cancelled || 0}</span>
                            </div>
                          </div>
                        </div>
                        {canteen.products && canteen.products.length > 0 && (
                          <div style={{
                            marginTop: '16px',
                            padding: '12px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                          }}>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 600 }}>
                              Produtos Encomendados:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {canteen.products.map((product: any, idx: number) => (
                                <div key={idx} style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  fontSize: '12px',
                                  padding: '4px 0',
                                  borderBottom: idx < canteen.products.length - 1 ? '1px solid #e5e7eb' : 'none',
                                }}>
                                  <span style={{ color: '#111827', fontWeight: 500 }}>
                                    {product.productName}
                                  </span>
                                  <span style={{
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    backgroundColor: product.status === 'delivered' ? '#dcfce7' :
                                                   product.status === 'pending' ? '#fef3c7' :
                                                   product.status === 'sent' ? '#dbeafe' :
                                                   product.status === 'confirmed' ? '#d1fae5' :
                                                   product.status === 'rejected' ? '#fee2e2' :
                                                   product.status === 'cancelled' ? '#f3f4f6' : '#f3f4f6',
                                    color: product.status === 'delivered' ? '#166534' :
                                           product.status === 'pending' ? '#92400e' :
                                           product.status === 'sent' ? '#1e40af' :
                                           product.status === 'confirmed' ? '#065f46' :
                                           product.status === 'rejected' ? '#991b1b' :
                                           product.status === 'cancelled' ? '#374151' : '#374151',
                                  }}>
                                    {product.status === 'delivered' ? 'Entregue' :
                                     product.status === 'pending' ? 'Pendente' :
                                     product.status === 'sent' ? 'Enviada' :
                                     product.status === 'confirmed' ? 'Confirmada' :
                                     product.status === 'rejected' ? 'Rejeitada' :
                                     product.status === 'cancelled' ? 'Cancelada' : product.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                  Não há encomendas disponíveis para exibir.
                </div>
              )}
            </div>

            {/* Produtos Entregues por Quantidade */}
            <div style={producerStatisticsStyles.chartCard}>
              <h3 style={producerStatisticsStyles.chartTitle}>Produtos Entregues (por Quantidade)</h3>
              {statistics.deliveredProducts && statistics.deliveredProducts.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}>
                  {statistics.deliveredProducts.map((product: any, index: number) => (
                    <div key={product.productId} style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid #e5e7eb',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#16a34a',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px',
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontWeight: 600,
                            color: '#111827',
                            fontSize: '16px',
                            marginBottom: '4px',
                          }}>
                            {product.productName}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>Quantidade Total:</span>
                          <span style={{ fontWeight: 600, color: '#111827', fontSize: '16px' }}>
                            {product.totalQuantity.toFixed(2)} {product.unit}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>Encomendas:</span>
                          <span style={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>
                            {product.orderCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                  Não há produtos entregues disponíveis para exibir.
                </div>
              )}
            </div>

            {/* Gráfico Circular - Distribuição de Produtos Entregues */}
            <div style={producerStatisticsStyles.chartCard}>
              <h3 style={producerStatisticsStyles.chartTitle}>Distribuição de Produtos Entregues</h3>
              {statistics.deliveredProducts && statistics.deliveredProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={statistics.deliveredProducts.map((product: any) => ({
                        name: product.productName.length > 20 ? product.productName.substring(0, 20) + '...' : product.productName,
                        value: product.totalQuantity,
                        fullName: product.productName,
                        unit: product.unit
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statistics.deliveredProducts.map((entry: any, index: number) => {
                        const colors = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value.toFixed(2)} ${props.payload.unit}`,
                        props.payload.fullName
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                  Não há produtos entregues disponíveis para exibir.
                </div>
              )}
            </div>

            {/* Estatísticas de Entrega */}
            <div style={producerStatisticsStyles.chartCard}>
              <h3 style={producerStatisticsStyles.chartTitle}>Estatísticas de Entrega</h3>
              {statistics.deliveryStats ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                  }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      Taxa de Entrega
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#16a34a' }}>
                      {statistics.deliveryStats.deliveryRate.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {statistics.ordersByCanteen?.reduce((sum: number, c: any) => sum + (c.ordersByStatus?.delivered || 0), 0) || 0} de {statistics.totalOrders} encomendas
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                  }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      Quantidade Média por Unidade
                    </div>
                    {statistics.deliveryStats.averageQuantityByUnit && statistics.deliveryStats.averageQuantityByUnit.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {statistics.deliveryStats.averageQuantityByUnit.map((item: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>{item.unit}:</span>
                            <span style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                              {item.averageQuantity.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>
                        -
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                      Média por unidade (separada)
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                  }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      Produtos Únicos Entregues
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }}>
                      {statistics.deliveryStats.uniqueProductsDelivered}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Diferentes produtos entregues
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                  Não há dados disponíveis para exibir.
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={producerStatisticsStyles.placeholderBox}>
            Não foi possível carregar as estatísticas.
          </div>
        )}
      </main>
    </div>
  );
}

