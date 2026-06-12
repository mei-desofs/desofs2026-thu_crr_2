import { useLogout } from "../../../util/useLogout";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Bell, LogOut, ArrowLeft, Calendar, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { wastePercentageStyles } from './WastePercentageScreen.styles';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { performanceService, type WastePercentageResponse } from "../../../services/performanceService";
import { wasteReportService, type WasteReportStatistics } from "../../../services/wasteReportService";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

const formatDateShort = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Função helper para renderizar calendário
const renderCalendar = (
  year: number,
  month: number,
  selectedDate: string | null,
  onDateSelect: (dateStr: string) => void,
  onMonthChange: (newMonth: number, newYear: number) => void
) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  const daysToShowBefore = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const firstDisplayDate = new Date(year, month, 1 - daysToShowBefore);
  const days: React.ReactElement[] = [];

  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(firstDisplayDate);
    currentDate.setDate(firstDisplayDate.getDate() + i);
    const isCurrentMonth = currentDate.getMonth() === month;
    const dateStr = currentDate.toISOString().split('T')[0];
    const isSelected = selectedDate === dateStr;

    days.push(
      <div
        key={i}
        onClick={() => onDateSelect(dateStr)}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "#374151";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
        style={{
          ...wastePercentageStyles.calendarDay,
          ...(isCurrentMonth ? {} : wastePercentageStyles.calendarDayOtherMonth),
          ...(isSelected ? wastePercentageStyles.calendarDaySelected : {}),
        }}
      >
        {currentDate.getDate()}
      </div>
    );
  }

  return (
    <div style={wastePercentageStyles.calendarContainer} data-calendar-container>
      <div style={wastePercentageStyles.calendarHeader}>
        <button
          onClick={() => {
            if (month === 0) {
              onMonthChange(11, year - 1);
            } else {
              onMonthChange(month - 1, year);
            }
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#374151"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          style={wastePercentageStyles.calendarNavButton}
        >
          <ChevronLeft size={16} />
        </button>
        <span style={wastePercentageStyles.calendarMonthYear}>
          {new Date(year, month).toLocaleDateString("pt-PT", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={() => {
            if (month === 11) {
              onMonthChange(0, year + 1);
            } else {
              onMonthChange(month + 1, year);
            }
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#374151"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          style={wastePercentageStyles.calendarNavButton}
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div style={wastePercentageStyles.calendarGrid}>
        {["S", "T", "Q", "Q", "S", "S", "D"].map((day, idx) => (
          <div key={idx} style={wastePercentageStyles.calendarDayHeader as React.CSSProperties}>
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default function WastePercentageScreen() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Utilizador";

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [reservationWasteData, setReservationWasteData] = useState<WastePercentageResponse | null>(null);
  const [wasteReportData, setWasteReportData] = useState<WasteReportStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refeitorioName, setRefeitorioName] = useState<string | null>(null);
  
  // Calendário
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const loadData = useCallback(async () => {
    if (!selectedDate) {
      setReservationWasteData(null);
      setWasteReportData(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Preparar filtros com refeitorioId se o utilizador for RefectoryManager ou RefectoryStaff
      const filters: any = {
        date: selectedDate,
        period: "day",
      };
      
      if ((user?.role === "RefectoryManager" || user?.role === "RefectoryStaff") && user?.refeitorioId) {
        filters.refeitorioId = user.refeitorioId;
      }

      // Carregar desperdício de reservas não consumidas
      const reservationData = await performanceService.getWastePercentage(filters);
      setReservationWasteData(reservationData);

      // Carregar desperdício de pratos (waste reports)
      const reportData = await wasteReportService.getWasteReportStatistics(filters);
      setWasteReportData(reportData);
    } catch (err: any) {
      console.error("Error loading waste data:", err);
      setError("Não foi possível carregar os dados de desperdício. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, user?.role, user?.refeitorioId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Buscar nome do refeitório
  useEffect(() => {
    const fetchRefeitorioName = async () => {
      // Se o user já tem refeitorio.name, usar diretamente
      if (user?.refeitorio?.name) {
        setRefeitorioName(user.refeitorio.name);
        return;
      }
      
      // Se tem refeitorioId mas não tem refeitorio.name, buscar
      if (user?.refeitorioId) {
        try {
          const response = await axios.get(`${API_BASE_URL}/refeitorios/${user.refeitorioId}`);
          if (response.data?.name) {
            setRefeitorioName(response.data.name);
          }
        } catch (err) {
          console.error("Erro ao buscar nome do refeitório:", err);
        }
      }
    };

    if (user && user.role === "RefectoryManager") {
      fetchRefeitorioName();
    }
  }, [user?.refeitorioId, user?.refeitorio?.name, user?.role, user]);

  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      setCalendarMonth(date.getMonth());
      setCalendarYear(date.getFullYear());
    }
  }, [selectedDate]);

  // Fechar calendário ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCalendar && !target.closest('[data-calendar-container]')) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const handleBack = () => {
    navigate("/statistics-dashboard");
  };

  const handleLogout = useLogout();

  return (
    <div style={wastePercentageStyles.pageContainer}>
      {/* Header */}
      <header style={wastePercentageStyles.header}>
        <div style={wastePercentageStyles.headerLeft}>
          <button
            style={wastePercentageStyles.backButton}
            onClick={handleBack}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <div style={wastePercentageStyles.headerInfo}>
            <h1 style={wastePercentageStyles.headerTitle}>BioCantinas</h1>
            <p style={wastePercentageStyles.headerSubtitle}>
              Bem-vindo, {userName}
            </p>
          </div>
        </div>
        <div style={wastePercentageStyles.headerActions}>
          <button 
            style={wastePercentageStyles.iconButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell size={20} />
          </button>
          <button 
            style={wastePercentageStyles.iconButton} 
            onClick={handleLogout}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={wastePercentageStyles.mainContent}>
        <div style={wastePercentageStyles.contentWrapper}>
          <div style={wastePercentageStyles.titleSection}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h2 style={wastePercentageStyles.pageTitle}>
                <Trash2 size={28} style={{ marginRight: '12px' }} />
                Percentagem de Desperdício
              </h2>
              {refeitorioName && user?.role === "RefectoryManager" && (
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#111827',
                  border: '1px solid #e5e7eb'
                }}>
                  {refeitorioName}
                </div>
              )}
            </div>
            <p style={wastePercentageStyles.pageDescription}>
              Visualize o desperdício de reservas não consumidas e desperdício de pratos por dia.
            </p>
          </div>

          {/* Filtro de Data */}
          <div style={wastePercentageStyles.filtersContainer}>
            <div style={wastePercentageStyles.filterGroup}>
              <label style={wastePercentageStyles.filterLabel} htmlFor="date-filter">Data:</label>
              <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-calendar-container>
                <div 
                  style={wastePercentageStyles.filterWrapper}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <Calendar size={16} />
                  <span style={{
                    ...wastePercentageStyles.dateButtonText,
                    color: selectedDate ? "#111827" : "#9ca3af",
                  }}>
                    {selectedDate ? formatDateShort(selectedDate) : "Selecionar dia..."}
                  </span>
                  {selectedDate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate("");
                      }}
                      style={wastePercentageStyles.clearDateButton}
                      aria-label="Limpar filtro de data"
                    >
                      ×
                    </button>
                  )}
                </div>
                {showCalendar && renderCalendar(
                  calendarYear,
                  calendarMonth,
                  selectedDate,
                  (dateStr) => {
                    setSelectedDate(dateStr);
                    setShowCalendar(false);
                  },
                  (newMonth, newYear) => {
                    setCalendarMonth(newMonth);
                    setCalendarYear(newYear);
                  }
                )}
              </div>
            </div>
          </div>

          {/* Resultados */}
          {loading ? (
            <div style={wastePercentageStyles.loadingContainer}>
              <p>A carregar dados...</p>
            </div>
          ) : error ? (
            <div style={wastePercentageStyles.errorContainer}>
              <p>{error}</p>
            </div>
          ) : !selectedDate ? (
            <div style={wastePercentageStyles.noDataContainer}>
              <p>Por favor, selecione uma data para ver os dados de desperdício.</p>
            </div>
          ) : (
            <>
              {/* Card de Desperdício Total */}
              {(() => {
                const reservationWaste = reservationWasteData?.wastePercentage || 0;
                const plateWaste = wasteReportData?.averageWaste || 0;
                
                // Calcular desperdício total combinado
                // Média ponderada: considerar ambos os tipos de desperdício
                // Se ambos existem, fazer média ponderada baseada no número de refeições
                let totalWaste = 0;
                let hasData = false;
                let calculationDetails = null;
                
                if (reservationWasteData && wasteReportData && wasteReportData.totalReports > 0) {
                  // Média ponderada: peso baseado no número de refeições
                  const reservationWeight = reservationWasteData.totalServed;
                  const plateWeight = wasteReportData.totalReports; // número de reports
                  const totalWeight = reservationWeight + plateWeight;
                  
                  if (totalWeight > 0) {
                    totalWaste = ((reservationWaste * reservationWeight) + (plateWaste * plateWeight)) / totalWeight;
                    hasData = true;
                    calculationDetails = {
                      reservationWaste,
                      reservationWeight,
                      plateWaste,
                      plateWeight,
                      totalWeight,
                      numerator: (reservationWaste * reservationWeight) + (plateWaste * plateWeight),
                    };
                  }
                } else if (reservationWasteData) {
                  totalWaste = reservationWaste;
                  hasData = true;
                } else if (wasteReportData && wasteReportData.totalReports > 0) {
                  totalWaste = plateWaste;
                  hasData = true;
                }

                return hasData ? (
                  <div style={wastePercentageStyles.totalWasteCard}>
                    <div style={wastePercentageStyles.totalWasteCardHeader}>
                      <h3 style={wastePercentageStyles.totalWasteCardTitle}>Desperdício Total do Dia</h3>
                      <p style={wastePercentageStyles.totalWasteCardSubtitle}>
                        {formatDateShort(selectedDate)}
                      </p>
                    </div>
                    <div style={wastePercentageStyles.totalWastePercentage}>
                      <span style={wastePercentageStyles.totalWastePercentageValue}>
                        {totalWaste.toFixed(2)}%
                      </span>
                      <p style={wastePercentageStyles.totalWastePercentageDescription}>
                        Média ponderada do desperdício de refeições não servidas e refeições servidas
                      </p>
                    </div>
                    {calculationDetails && (
                      <div style={wastePercentageStyles.calculationDetails}>
                        <p style={wastePercentageStyles.calculationTitle}>Fórmula:</p>
                        <div style={wastePercentageStyles.calculationFormula}>
                          <span>
                            ((% de Refeições Não Servidas × Total de Refeições Marcadas) + (% de Refeições Servidas × Total de Reports)) / (Total de Refeições Marcadas + Total de Reports)
                          </span>
                        </div>
                      </div>
                    )}
                    <div style={wastePercentageStyles.totalWasteBreakdown}>
                      <div style={wastePercentageStyles.totalWasteBreakdownItem}>
                        <span style={wastePercentageStyles.totalWasteBreakdownLabel}>Refeições Não Servidas:</span>
                        <span style={wastePercentageStyles.totalWasteBreakdownValue}>
                          {reservationWaste.toFixed(2)}%
                        </span>
                      </div>
                      <div style={wastePercentageStyles.totalWasteBreakdownItem}>
                        <span style={wastePercentageStyles.totalWasteBreakdownLabel}>Refeições Servidas:</span>
                        <span style={wastePercentageStyles.totalWasteBreakdownValue}>
                          {plateWaste.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              <div style={wastePercentageStyles.wasteCardsContainer}>
                {/* Card de Desperdício de Reservas Não Consumidas */}
                <div style={wastePercentageStyles.wasteCard}>
                  <div style={wastePercentageStyles.wasteCardHeader}>
                    <h3 style={wastePercentageStyles.wasteCardTitle}>Desperdício de Refeições Não Servidas</h3>
                    <p style={wastePercentageStyles.wasteCardSubtitle}>
                      Reservas marcadas mas não consumidas
                    </p>
                  </div>
                  {reservationWasteData ? (
                    <div style={wastePercentageStyles.wasteCardContent}>
                      <div style={wastePercentageStyles.wasteStat}>
                        <span style={wastePercentageStyles.wasteStatLabel}>Refeições Marcadas:</span>
                        <span style={wastePercentageStyles.wasteStatValue}>{reservationWasteData.totalServed}</span>
                      </div>
                      <div style={wastePercentageStyles.wasteStat}>
                        <span style={wastePercentageStyles.wasteStatLabel}>Servidas:</span>
                        <span style={wastePercentageStyles.wasteStatValue}>
                          {reservationWasteData.totalServed - reservationWasteData.totalNotConsumed}
                        </span>
                      </div>
                      <div style={wastePercentageStyles.wasteStat}>
                        <span style={wastePercentageStyles.wasteStatLabel}>Não Servidas:</span>
                        <span style={wastePercentageStyles.wasteStatValue}>{reservationWasteData.totalNotConsumed}</span>
                      </div>
                      <div style={wastePercentageStyles.wastePercentage}>
                        <span style={wastePercentageStyles.wastePercentageLabel}>Desperdício (Refeições Não Servidas):</span>
                        <span style={wastePercentageStyles.wastePercentageValue}>
                          {reservationWasteData.wastePercentage.toFixed(2)}%
                        </span>
                      </div>
                      {reservationWasteData.byMeal && reservationWasteData.byMeal.length > 0 && (
                        <div style={wastePercentageStyles.wasteMealsList}>
                          <p style={wastePercentageStyles.wasteMealsListTitle}>Refeições:</p>
                          {reservationWasteData.byMeal.map((mealData) => (
                            <div key={mealData.mealId} style={wastePercentageStyles.wasteMealItem}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span style={wastePercentageStyles.wasteMealName}>{mealData.mealName}</span>
                                  {mealData.mealTypeId && (
                                    <span style={{
                                      backgroundColor: mealData.mealTypeId === 1 ? "#fef3c7" : "#dbeafe",
                                      color: mealData.mealTypeId === 1 ? "#92400e" : "#1e40af",
                                      padding: "2px 8px",
                                      borderRadius: "10px",
                                      fontSize: "10px",
                                      fontWeight: 700,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}>
                                      {mealData.mealTypeId === 1 ? "Almoço" : "Jantar"}
                                    </span>
                                  )}
                                  {mealData.dishTypeId && (
                                    <span style={{
                                      backgroundColor: mealData.dishTypeId === 1 ? "#fee2e2" : mealData.dishTypeId === 2 ? "#dbeafe" : "#d1fae5",
                                      color: mealData.dishTypeId === 1 ? "#991b1b" : mealData.dishTypeId === 2 ? "#1e40af" : "#065f46",
                                      padding: "2px 8px",
                                      borderRadius: "10px",
                                      fontSize: "10px",
                                      fontWeight: 700,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}>
                                      {mealData.dishTypeId === 1 ? "Carne" : mealData.dishTypeId === 2 ? "Peixe" : "Vegetariano"}
                                    </span>
                                  )}
                                </div>
                                {mealData.dishName && (
                                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                    {mealData.dishName}
                                  </span>
                                )}
                                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                  Servidas: {mealData.consumed || (mealData.served - mealData.notConsumed)} | Não Servidas: {mealData.notConsumed}
                                </span>
                              </div>
                              <span style={wastePercentageStyles.wasteMealPercentage}>
                                {mealData.percentage.toFixed(2)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={wastePercentageStyles.noDataInCard}>
                      <p>Não há dados de desperdício de reservas para esta data.</p>
                    </div>
                  )}
                </div>

                {/* Card de Desperdício de Refeições Servidas */}
                <div style={wastePercentageStyles.wasteCard}>
                  <div style={wastePercentageStyles.wasteCardHeader}>
                    <h3 style={wastePercentageStyles.wasteCardTitle}>Desperdício de Refeições Servidas</h3>
                    <p style={wastePercentageStyles.wasteCardSubtitle}>
                      Comida deixada no prato após consumo, reportado pelo canteen staff
                    </p>
                  </div>
                  {wasteReportData && wasteReportData.totalReports > 0 ? (
                    <div style={wastePercentageStyles.wasteCardContent}>
                      <div style={wastePercentageStyles.wasteStat}>
                        <span style={wastePercentageStyles.wasteStatLabel}>Refeições Servidas:</span>
                        <span style={wastePercentageStyles.wasteStatValue}>
                          {reservationWasteData ? reservationWasteData.totalServed - reservationWasteData.totalNotConsumed : '-'}
                        </span>
                      </div>
                      <div style={wastePercentageStyles.wasteStat}>
                        <span style={wastePercentageStyles.wasteStatLabel}>Total de Reports:</span>
                        <span style={wastePercentageStyles.wasteStatValue}>{wasteReportData.totalReports}</span>
                      </div>
                      <div style={wastePercentageStyles.wastePercentage}>
                        <span style={wastePercentageStyles.wastePercentageLabel}>Desperdício (Refeições Servidas):</span>
                        <span style={wastePercentageStyles.wastePercentageValue}>
                          {wasteReportData.averageWaste.toFixed(2)}%
                        </span>
                      </div>
                      {wasteReportData.byMeal && wasteReportData.byMeal.length > 0 && (
                        <div style={wastePercentageStyles.wasteMealsList}>
                          <p style={wastePercentageStyles.wasteMealsListTitle}>Refeições:</p>
                          {wasteReportData.byMeal.map((mealData) => (
                            <div key={mealData.mealId} style={wastePercentageStyles.wasteMealItem}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span style={wastePercentageStyles.wasteMealName}>{mealData.mealName}</span>
                                  {mealData.mealTypeId && (
                                    <span style={{
                                      backgroundColor: mealData.mealTypeId === 1 ? "#fef3c7" : "#dbeafe",
                                      color: mealData.mealTypeId === 1 ? "#92400e" : "#1e40af",
                                      padding: "2px 8px",
                                      borderRadius: "10px",
                                      fontSize: "10px",
                                      fontWeight: 700,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}>
                                      {mealData.mealTypeId === 1 ? "Almoço" : "Jantar"}
                                    </span>
                                  )}
                                  {mealData.dishTypeId && (
                                    <span style={{
                                      backgroundColor: mealData.dishTypeId === 1 ? "#fee2e2" : mealData.dishTypeId === 2 ? "#dbeafe" : "#d1fae5",
                                      color: mealData.dishTypeId === 1 ? "#991b1b" : mealData.dishTypeId === 2 ? "#1e40af" : "#065f46",
                                      padding: "2px 8px",
                                      borderRadius: "10px",
                                      fontSize: "10px",
                                      fontWeight: 700,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}>
                                      {mealData.dishTypeId === 1 ? "Carne" : mealData.dishTypeId === 2 ? "Peixe" : "Vegetariano"}
                                    </span>
                                  )}
                                </div>
                                {mealData.dishName && (
                                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                    {mealData.dishName}
                                  </span>
                                )}
                                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                  Reports: {mealData.totalReports}
                                </span>
                              </div>
                              <span style={wastePercentageStyles.wasteMealPercentage}>
                                {mealData.averageWaste.toFixed(2)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={wastePercentageStyles.noDataInCard}>
                      <p>Não há dados de desperdício de refeições servidas para esta data.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

