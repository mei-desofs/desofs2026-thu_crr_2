/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft, Bell, LogOut, Filter, Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { reservationsViewStyles } from "./ReservationsViewScreen.styles";
import { useEffect, useState, useCallback } from "react";
import { reservationService, type ReservationWithRelations } from "../../services/reservationService";
import { wasteReportService } from "../../services/wasteReportService";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

type ReservationStatus = "all" | "active" | "consumed" | "not consumed";
type MealTypeFilter = "all" | "1" | "2"; // "all" = todas, "1" = almoço, "2" = jantar

const formatDate = (value?: string | Date) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateShort = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function ReservationsViewScreen() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReservationStatus>("all");
  const [mealTypeFilter, setMealTypeFilter] = useState<MealTypeFilter>("all");
  const [searchName, setSearchName] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (dateFilter) {
      const date = new Date(dateFilter);
      setCalendarMonth(date.getMonth());
      setCalendarYear(date.getFullYear());
    }
  }, [dateFilter]);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
  const [selectedReservation, setSelectedReservation] = useState<number | null>(null);
  const [quantityToLift, setQuantityToLift] = useState<string>("1");
  
  // Waste report states
  const user = useSelector((state: any) => state.auth.user);
  const [showWasteReportModal, setShowWasteReportModal] = useState(false);
  const [selectedMealForReport, setSelectedMealForReport] = useState<{ mealId: number; mealName: string; consumedQuantity: number; reservationId?: number } | null>(null);
  const [wastePercentage, setWastePercentage] = useState<number>(0);
  const [reportingWaste, setReportingWaste] = useState(false);
  // Usar chave mealId-refeitorioId para rastrear reports por refeitório
  const [reportedMealIds, setReportedMealIds] = useState<Set<string>>(new Set());
  const [refeitorioName, setRefeitorioName] = useState<string | null>(null);

  const handleLogout = () => {
    navigate("/login");
  };

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { status?: string; refeitorioId?: number } = {};
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      // Filtrar pelo refeitório do utilizador logado
      if (user?.refeitorioId) {
        params.refeitorioId = user.refeitorioId;
      }
      const data = await reservationService.listReservations(params);
      setReservations(data || []);

      // Verificar reports existentes APENAS para o refeitório do utilizador
      // Só verificar quando não há reservas active (depois do cronjob passar)
      const reportedIds = new Set<string>();
      if (user?.refeitorioId && data && data.length > 0) {
        // Agrupar reservas por meal-refeitorioId para identificar grupos que precisam de verificação
        const groupsToCheck: { [key: string]: boolean } = {};
        data.forEach((r: any) => {
          if (r.meal?.id && r.refeitorioId === user.refeitorioId) {
            const key = `${r.meal.id}-${r.refeitorioId}`;
            // Só verificar se não há reservas active (cronjob já passou) E há reservas consumed
            if (r.status === "consumed" && !groupsToCheck.hasOwnProperty(key)) {
              // Verificar se há reservas active para este grupo
              const hasActive = data.some((other: any) => 
                other.meal?.id === r.meal.id && 
                other.refeitorioId === r.refeitorioId && 
                other.status === "active"
              );
              if (!hasActive) {
                groupsToCheck[key] = true;
              }
            }
          }
        });

        // Verificar reports apenas para os grupos que precisam (só do refeitório do utilizador)
        await Promise.all(
          Object.keys(groupsToCheck).map(async (key) => {
            try {
              const [mealIdStr] = key.split('-');
              const mealId = Number(mealIdStr);
              const reports = await wasteReportService.getWasteReportsByMeal(mealId);
              // Filtrar APENAS reports do refeitório do utilizador
              const userRefeitorioReports = reports.filter((report: any) => 
                report.refeitorioId === user.refeitorioId
              );
              if (userRefeitorioReports && userRefeitorioReports.length > 0) {
                reportedIds.add(key);
              }
            } catch (err) {
              // Ignorar erros - se falhar, não marca como reportado (botão aparece)
            }
          })
        );
      }
      setReportedMealIds(reportedIds);
    } catch {
      setError("Não foi possível carregar as marcações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, user?.refeitorioId]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

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

    if (user) {
      fetchRefeitorioName();
    }
  }, [user?.refeitorioId, user?.refeitorio?.name, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCalendar && !target.closest('[data-calendar-container]')) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const filteredReservations = (() => {
    let filtered = reservations.filter((r) => r.status !== "canceled");
    
    // Filtrar por status
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }
    
    // Filtrar por nome
    if (searchName.trim()) {
      const searchLower = searchName.toLowerCase().trim();
      filtered = filtered.filter((r) => 
        r.user?.name?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrar por data da refeição
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      const filterDateStr = filterDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      filtered = filtered.filter((r) => {
        if (!r.meal?.date) return false;
        const mealDate = new Date(r.meal.date);
        const mealDateStr = mealDate.toISOString().split('T')[0];
        return mealDateStr === filterDateStr;
      });
    }
    
    // Filtrar por tipo de refeição (almoço/jantar)
    if (mealTypeFilter !== "all") {
      filtered = filtered.filter((r) => {
        return r.meal?.mealTypeId === Number(mealTypeFilter);
      });
    }
    
    return filtered;
  })();

  // Agrupar reservas por utilizador, refeição, data E REFEITÓRIO (cada refeitório tem o seu próprio grupo)
  const groupedReservations = (() => {
    const groups: Record<string, {
      userId: number;
      userName: string;
      mealId: number;
      mealName: string;
      mealTypeId?: number;
      dishName?: string;
      mealDate?: string;
      reservationDate: string;
      canteenName?: string;
      refeitorioId: number;
      refeitorioName?: string;
      activeQuantity: number;
      consumedQuantity: number;
      notConsumedQuantity: number;
      activeReservations: any[];
      consumedReservations: any[];
      notConsumedReservations: any[];
    }> = {};

    filteredReservations.forEach((reservation) => {
      // Incluir refeitorioId na chave para separar por refeitório
      const key = `${reservation.userId}-${reservation.mealId}-${reservation.meal?.date || reservation.reservationDate}-${reservation.refeitorioId}`;
      
      if (!groups[key]) {
        groups[key] = {
          userId: reservation.userId,
          userName: reservation.user?.name || `Utilizador ID: ${reservation.userId}`,
          mealId: reservation.mealId,
          mealName: reservation.meal?.name || `Refeição ID: ${reservation.mealId}`,
          mealTypeId: reservation.meal?.mealTypeId,
          dishName: reservation.meal?.dish?.name,
          mealDate: reservation.meal?.date,
          reservationDate: reservation.reservationDate,
          canteenName: reservation.meal?.canteen?.name,
          refeitorioId: reservation.refeitorioId,
          refeitorioName: reservation.refeitorio?.name,
          activeQuantity: 0,
          consumedQuantity: 0,
          notConsumedQuantity: 0,
          activeReservations: [],
          consumedReservations: [],
          notConsumedReservations: [],
        };
      }

      if (reservation.status === "active") {
        groups[key].activeQuantity += reservation.quantity || 1;
        groups[key].activeReservations.push(reservation);
      } else if (reservation.status === "consumed") {
        groups[key].consumedQuantity += reservation.quantity || 1;
        groups[key].consumedReservations.push(reservation);
      } else if (reservation.status === "not consumed") {
        groups[key].notConsumedQuantity += reservation.quantity || 1;
        groups[key].notConsumedReservations.push(reservation);
      }
    });

    return Object.values(groups);
  })();

  // Calcular totais de marcações
  const totalMarcacoes = filteredReservations.reduce((sum, r) => sum + (r.quantity || 1), 0);
  const totalLevantadas = filteredReservations
    .filter(r => r.status === "consumed")
    .reduce((sum, r) => sum + (r.quantity || 1), 0);
  const totalRealizadas = filteredReservations
    .filter(r => r.status === "active")
    .reduce((sum, r) => sum + (r.quantity || 1), 0);
  const totalNaoLevantadas = filteredReservations
    .filter(r => r.status === "not consumed")
    .reduce((sum, r) => sum + (r.quantity || 1), 0);

  const getStatusBadgeStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return { ...reservationsViewStyles.statusBadge, ...reservationsViewStyles.statusActive };
      case "consumed":
        return { ...reservationsViewStyles.statusBadge, ...reservationsViewStyles.statusConsumed };
      case "not consumed":
        return { ...reservationsViewStyles.statusBadge, ...reservationsViewStyles.statusNotConsumed };
      default:
        return { ...reservationsViewStyles.statusBadge, ...reservationsViewStyles.statusActive };
    }
  };



  const handleOpenLiftModal = (reservationId: number) => {
    setSelectedReservation(reservationId);
    setQuantityToLift("1");
  };

  const handleCloseModal = () => {
    setSelectedReservation(null);
    setQuantityToLift("1");
  };

  const handleLiftTickets = async () => {
    if (!selectedReservation) return;
    
    const reservation = reservations.find(r => r.id === selectedReservation);
    if (!reservation) return;

    const quantity = parseInt(quantityToLift);
    if (isNaN(quantity) || quantity < 1 || quantity > reservation.quantity) {
      setError(`A quantidade deve estar entre 1 e ${reservation.quantity}`);
      return;
    }

    setUpdatingIds(prev => new Set(prev).add(selectedReservation));
    setError(null);
    
    try {
      // Usar o endpoint específico para levantar marcações
      await reservationService.liftTickets(selectedReservation, quantity);

      await loadReservations();
      handleCloseModal();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Não foi possível levantar as marcações. Tente novamente.";
      setError(errorMessage);
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedReservation);
        return newSet;
      });
    }
  };

  const handleOpenWasteReportModal = (mealId: number, mealName: string, consumedQuantity: number, reservationId?: number) => {
    setSelectedMealForReport({ mealId, mealName, consumedQuantity, reservationId });
    setWastePercentage(0);
    setShowWasteReportModal(true);
  };

  const handleCloseWasteReportModal = () => {
    setShowWasteReportModal(false);
    setSelectedMealForReport(null);
    setWastePercentage(0);
  };

  const handleSubmitWasteReport = async () => {
    if (!selectedMealForReport || !user || !user.refeitorioId) {
      setError("Não foi possível identificar o refeitório. Por favor, faça login novamente.");
      return;
    }

    setReportingWaste(true);
    setError(null);

    try {
      const result = await wasteReportService.createWasteReport({
        wastePercentage,
        mealId: selectedMealForReport.mealId,
        reservationId: selectedMealForReport.reservationId,
        reportedBy: user.id,
        refeitorioId: user.refeitorioId,
      });

      console.log("Report criado com sucesso:", result);

      // Adicionar mealId-refeitorioId à lista de reportados
      const reportKey = `${selectedMealForReport.mealId}-${user.refeitorioId}`;
      console.log("Adicionando reportKey ao estado:", reportKey);
      setReportedMealIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(reportKey);
        console.log("Novo reportedMealIds:", Array.from(newSet));
        return newSet;
      });

      handleCloseWasteReportModal();

      // Recarregar reservas para atualizar a UI (mas manter reportedMealIds)
      // Não usar loadReservations() porque ele reseta reportedMealIds
      try {
        const params: { status?: string; refeitorioId?: number } = {};
        if (statusFilter !== "all") {
          params.status = statusFilter;
        }
        if (user?.refeitorioId) {
          params.refeitorioId = user.refeitorioId;
        }
        const data = await reservationService.listReservations(params);
        setReservations(data || []);
      } catch (err) {
        console.error("Erro ao recarregar reservas (não crítico):", err);
        // Ignorar erros ao recarregar - o importante é que o report foi criado
      }
    } catch (err: any) {
      console.error("Erro completo ao reportar desperdício:", err);
      console.error("Erro response:", err.response);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || "Não foi possível reportar o desperdício. Tente novamente.";
      setError(errorMessage);
    } finally {
      setReportingWaste(false);
    }
  };

  return (
    <div style={reservationsViewStyles.pageContainer}>
      <header style={reservationsViewStyles.header}>
        <div style={reservationsViewStyles.headerLeft}>
          <button
            style={reservationsViewStyles.backButton}
            onClick={() => navigate("/canteenstaff-dashboard")}
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <div style={reservationsViewStyles.headerText}>
            <h1 style={reservationsViewStyles.headerTitle}>Gestão de Marcações</h1>
            <p style={reservationsViewStyles.headerSubtitle}>
              {refeitorioName ? `Refeitório: ${refeitorioName}` : "Sistema de levantamento de reservas de refeições"}
            </p>
          </div>
        </div>
        <div style={reservationsViewStyles.headerActions}>
          <button style={reservationsViewStyles.iconButton} aria-label="Notificações">
            <Bell size={20} />
          </button>
          <button
            style={reservationsViewStyles.iconButton}
            aria-label="Sair"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main style={reservationsViewStyles.mainContent}>
        <div style={reservationsViewStyles.toolbar}>
          <div style={reservationsViewStyles.searchWrapper}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={reservationsViewStyles.searchInput}
            />
          </div>
          <div style={{ position: "relative" }} data-calendar-container>
            <div 
              style={reservationsViewStyles.filterWrapper}
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <Calendar size={16} />
              <span style={{
                ...reservationsViewStyles.dateButtonText,
                color: dateFilter ? "#111827" : "#9ca3af",
              }}>
                {dateFilter ? formatDateShort(dateFilter) : "Filtrar por data..."}
              </span>
              {dateFilter && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateFilter("");
                  }}
                  style={reservationsViewStyles.clearDateButton}
                  aria-label="Limpar filtro de data"
                >
                  ×
                </button>
              )}
            </div>
            {showCalendar && (
              <div style={reservationsViewStyles.calendarContainer} data-calendar-container>
                <div style={reservationsViewStyles.calendarHeader}>
                  <button
                    onClick={() => {
                      if (calendarMonth === 0) {
                        setCalendarMonth(11);
                        setCalendarYear(calendarYear - 1);
                      } else {
                        setCalendarMonth(calendarMonth - 1);
                      }
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#374151"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    style={reservationsViewStyles.calendarNavButton}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span style={reservationsViewStyles.calendarMonthYear}>
                    {new Date(calendarYear, calendarMonth).toLocaleDateString("pt-PT", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => {
                      if (calendarMonth === 11) {
                        setCalendarMonth(0);
                        setCalendarYear(calendarYear + 1);
                      } else {
                        setCalendarMonth(calendarMonth + 1);
                      }
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#374151"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    style={reservationsViewStyles.calendarNavButton}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div style={reservationsViewStyles.calendarGrid}>
                  {["S", "T", "Q", "Q", "S", "S", "D"].map((day, idx) => (
                    <div key={idx} style={reservationsViewStyles.calendarDayHeader as React.CSSProperties}>
                      {day}
                    </div>
                  ))}
                  {(() => {
                    // Criar data do primeiro dia do mês
                    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1);
                    // getDay() retorna: 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado
                    // Array de dias: ["S", "T", "Q", "Q", "S", "S", "D"]
                    // Índice 0 = S (Segunda), índice 1 = T (Terça), ..., índice 6 = D (Domingo)
                    // Converter getDay() para o índice do array:
                    // Domingo (0) -> índice 6
                    // Segunda (1) -> índice 0
                    // Terça (2) -> índice 1
                    // etc.
                    const dayOfWeek = firstDayOfMonth.getDay();
                    const arrayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Domingo vira 6, Segunda vira 0
                    
                    // Calcular quantos dias do mês anterior mostrar para começar na Segunda-feira
                    const daysToShowBefore = arrayIndex;
                    
                    // Calcular o primeiro dia a mostrar (sempre uma Segunda-feira)
                    const firstDisplayDate = new Date(calendarYear, calendarMonth, 1 - daysToShowBefore);
                    const days: React.ReactElement[] = [];
                    
                    // Gerar 42 dias (6 semanas)
                    for (let i = 0; i < 42; i++) {
                      const currentDate = new Date(firstDisplayDate);
                      currentDate.setDate(firstDisplayDate.getDate() + i);
                      const isCurrentMonth = currentDate.getMonth() === calendarMonth;
                      const dateStr = currentDate.toISOString().split('T')[0];
                      const isSelected = dateFilter === dateStr;
                      
                      days.push(
                        <div
                          key={i}
                          onClick={() => {
                            setDateFilter(dateStr);
                            setShowCalendar(false);
                          }}
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
                            ...reservationsViewStyles.calendarDay,
                            ...(isCurrentMonth ? {} : reservationsViewStyles.calendarDayOtherMonth),
                            ...(isSelected ? reservationsViewStyles.calendarDaySelected : {}),
                          }}
                        >
                          {currentDate.getDate()}
                        </div>
                      );
                    }
                    return days;
                  })()}
                </div>
              </div>
            )}
          </div>
          <div style={reservationsViewStyles.filterWrapper}>
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ReservationStatus)}
              style={reservationsViewStyles.select}
            >
              <option value="all">Todas</option>
              <option value="active">Ativas (Marcações por levantar)</option>
              <option value="consumed">Consumidas (Marcações levantadas)</option>
              <option value="not consumed">Não Consumidas (Marcações não levantadas)</option>
            </select>
          </div>
          <div style={reservationsViewStyles.filterWrapper}>
            <Filter size={16} />
            <select
              value={mealTypeFilter}
              onChange={(e) => setMealTypeFilter(e.target.value as MealTypeFilter)}
              style={reservationsViewStyles.select}
            >
              <option value="all">Todas</option>
              <option value="1">Almoço</option>
              <option value="2">Jantar</option>
            </select>
          </div>
        </div>

        {!loading && filteredReservations.length > 0 && (
          <div style={reservationsViewStyles.summaryContainer}>
            <div style={reservationsViewStyles.summaryBox}>
              <strong>Total de Marcações: {totalMarcacoes}</strong>
            </div>
            <div style={reservationsViewStyles.summaryStats}>
              {/* Mostrar cartões baseado no filtro selecionado */}
              {(statusFilter === "all" || statusFilter === "consumed") && (
                <div style={reservationsViewStyles.statBox}>
                  <span style={reservationsViewStyles.statLabel}>Consumidas (Marcações levantadas):</span>
                  <span style={reservationsViewStyles.statValue}>{totalLevantadas}</span>
                </div>
              )}
              {(statusFilter === "all" || statusFilter === "active") && (
                <div style={reservationsViewStyles.statBox}>
                  <span style={reservationsViewStyles.statLabel}>Ativas (Marcações por levantar):</span>
                  <span style={reservationsViewStyles.statValue}>{totalRealizadas}</span>
                </div>
              )}
              {(statusFilter === "all" || statusFilter === "not consumed") && (
                <div style={reservationsViewStyles.statBox}>
                  <span style={reservationsViewStyles.statLabel}>Não Consumidas (Marcações não levantadas):</span>
                  <span style={reservationsViewStyles.statValue}>{totalNaoLevantadas}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {error && <div style={reservationsViewStyles.errorBox}>{error}</div>}

        {loading ? (
          <div style={reservationsViewStyles.placeholderBox}>A carregar marcações...</div>
        ) : filteredReservations.length === 0 ? (
          <div style={reservationsViewStyles.placeholderBox}>
            {searchName.trim() 
              ? `Nenhuma marcação encontrada para "${searchName}".` 
              : statusFilter !== "all" || mealTypeFilter !== "all"
                ? `Nenhuma marcação encontrada com os filtros selecionados.`
                : "Nenhuma marcação encontrada."}
          </div>
        ) : (
          <div style={reservationsViewStyles.reservationsList}>
            {groupedReservations.map((group, index) => (
              <div key={`${group.userId}-${group.mealId}-${index}`} style={reservationsViewStyles.groupedCard}>
                <div style={reservationsViewStyles.groupedHeader}>
                  <div style={reservationsViewStyles.groupedInfo}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <h3 style={reservationsViewStyles.reservationTitle}>
                        {group.userName}
                      </h3>
                      {group.refeitorioName && (
                        <span style={{
                          color: "#111827",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}>
                          • {group.refeitorioName}
                        </span>
                      )}
                      {group.mealTypeId && (
                        <span style={{
                          backgroundColor: group.mealTypeId === 1 ? "#fef3c7" : "#dbeafe",
                          color: group.mealTypeId === 1 ? "#92400e" : "#1e40af",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}>
                          {group.mealTypeId === 1 ? "Almoço" : "Jantar"}
                        </span>
                      )}
                    </div>
                    <div style={reservationsViewStyles.reservationMeta}>
                      <span>
                        <strong>Refeição:</strong> {group.mealName}
                      </span>
                      {group.dishName && (
                        <span>
                          <strong>Prato:</strong> {group.dishName}
                        </span>
                      )}
                      {group.canteenName && (
                        <span>
                          <strong>Cantina:</strong> {group.canteenName}
                        </span>
                      )}
                      <span>
                        <strong>Data da Reserva:</strong> {formatDate(group.reservationDate)}
                      </span>
                      {group.mealDate && (
                        <span>
                          <strong>Data da Refeição:</strong> {formatDate(group.mealDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div style={reservationsViewStyles.quantitySections}>
                  {/* Mostrar seções baseado no filtro selecionado */}
                  {(statusFilter === "all" || statusFilter === "consumed") && group.consumedQuantity > 0 && (
                    <div style={reservationsViewStyles.quantitySection}>
                      <div style={reservationsViewStyles.sectionHeader}>
                        <span style={reservationsViewStyles.sectionTitle}>Consumidas (Marcações levantadas)</span>
                        <span style={reservationsViewStyles.sectionBadgeConsumed}>
                          {group.consumedQuantity} {group.consumedQuantity === 1 ? "marcação" : "marcações"}
                        </span>
                      </div>
                      {/* Mostrar botão para reportar desperdício APENAS depois do cronjob passar (quando não há reservas active) */}
                      {/* Cada refeitório tem o seu próprio botão */}
                      {group.activeQuantity === 0 && (
                        <button
                          onClick={() => {
                            const reportKey = `${group.mealId}-${group.refeitorioId}`;
                            if (!reportedMealIds.has(reportKey)) {
                              // Usar o primeiro reservationId das reservas consumidas
                              const firstConsumedReservation = group.consumedReservations[0];
                              const reservationId = firstConsumedReservation?.id;
                              handleOpenWasteReportModal(group.mealId, group.mealName, group.consumedQuantity, reservationId);
                            }
                          }}
                          disabled={reportedMealIds.has(`${group.mealId}-${group.refeitorioId}`)}
                          style={{
                            ...reservationsViewStyles.consumeButton,
                            backgroundColor: reportedMealIds.has(`${group.mealId}-${group.refeitorioId}`) ? "#6b7280" : "#f59e0b",
                            marginTop: "12px",
                            opacity: reportedMealIds.has(`${group.mealId}-${group.refeitorioId}`) ? 0.6 : 1,
                            cursor: reportedMealIds.has(`${group.mealId}-${group.refeitorioId}`) ? "not-allowed" : "pointer",
                          }}
                          onMouseEnter={(e) => {
                            if (!reportedMealIds.has(`${group.mealId}-${group.refeitorioId}`)) {
                              e.currentTarget.style.backgroundColor = "#d97706";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!reportedMealIds.has(`${group.mealId}-${group.refeitorioId}`)) {
                              e.currentTarget.style.backgroundColor = "#f59e0b";
                            }
                          }}
                        >
                          {reportedMealIds.has(`${group.mealId}-${group.refeitorioId}`) ? "Obrigado por reportar!" : "Reportar Desperdício"}
                        </button>
                      )}
                    </div>
                  )}
                  
                  {(statusFilter === "all" || statusFilter === "active") && group.activeQuantity > 0 && (
                    <div style={reservationsViewStyles.quantitySection}>
                      <div style={reservationsViewStyles.sectionHeader}>
                        <span style={reservationsViewStyles.sectionTitle}>Ativas (Marcações por levantar)</span>
                        <span style={reservationsViewStyles.sectionBadgeActive}>
                          {group.activeQuantity} {group.activeQuantity === 1 ? "marcação" : "marcações"}
                        </span>
                      </div>
                      {group.activeReservations.map((reservation) => (
                        <div key={reservation.id} style={reservationsViewStyles.activeReservationRow}>
                          <div style={reservationsViewStyles.quantityInfo}>
                            <span style={reservationsViewStyles.quantityLabel}>Quantidade:</span>
                            <span style={reservationsViewStyles.quantityValue}>
                              {reservation.quantity || 1} {reservation.quantity === 1 ? "marcação" : "marcações"}
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenLiftModal(reservation.id)}
                            disabled={updatingIds.has(reservation.id)}
                            style={{
                              ...reservationsViewStyles.consumeButton,
                              opacity: updatingIds.has(reservation.id) ? 0.6 : 1,
                              cursor: updatingIds.has(reservation.id) ? "not-allowed" : "pointer",
                            }}
                            onMouseEnter={(e) => {
                              if (!updatingIds.has(reservation.id)) {
                                e.currentTarget.style.backgroundColor = "#15803d";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!updatingIds.has(reservation.id)) {
                                e.currentTarget.style.backgroundColor = "#16a34a";
                              }
                            }}
                          >
                            {updatingIds.has(reservation.id) 
                              ? "A processar..." 
                              : (reservation.quantity || 1) === 1 ? "Levantar Marcação" : "Levantar Marcações"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {(statusFilter === "all" || statusFilter === "not consumed") && group.notConsumedQuantity > 0 && (
                    <div style={reservationsViewStyles.quantitySection}>
                      <div style={reservationsViewStyles.sectionHeader}>
                        <span style={reservationsViewStyles.sectionTitle}>Não Consumidas (Marcações não levantadas)</span>
                        <span style={getStatusBadgeStyle("not consumed")}>
                          {group.notConsumedQuantity} {group.notConsumedQuantity === 1 ? "marcação" : "marcações"}
                        </span>
                      </div>
                      {group.notConsumedReservations.map((reservation) => (
                        <div key={reservation.id} style={reservationsViewStyles.activeReservationRow}>
                          <div style={reservationsViewStyles.quantityInfo}>
                            <span style={reservationsViewStyles.quantityLabel}>Quantidade:</span>
                            <span style={reservationsViewStyles.quantityValue}>
                              {reservation.quantity || 1} {reservation.quantity === 1 ? "marcação" : "marcações"}
                            </span>
                          </div>
                          <span style={getStatusBadgeStyle("not consumed")}>
                            Não Consumida
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal para levantar marcações */}
        {selectedReservation && (() => {
          const reservation = reservations.find(r => r.id === selectedReservation);
          if (!reservation) return null;
          
          return (
            <div style={reservationsViewStyles.modalOverlay} onClick={handleCloseModal}>
              <div style={reservationsViewStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 style={reservationsViewStyles.modalTitle}>
                  {reservation.quantity === 1 ? "Levantar Marcação" : "Levantar Marcações"}
                </h3>
                <p style={reservationsViewStyles.modalDescription}>
                  {reservation.quantity === 1 
                    ? `Deseja levantar a marcação? (Disponível: ${reservation.quantity})`
                    : `Quantas marcações deseja levantar? (Disponível: ${reservation.quantity})`}
                </p>
                <div style={reservationsViewStyles.modalInputWrapper}>
                  <input
                    type="number"
                    min="1"
                    max={reservation.quantity}
                    value={quantityToLift}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Permitir campo vazio temporariamente
                      if (inputValue === "") {
                        setQuantityToLift("");
                        return;
                      }
                      // Validar apenas números
                      const numValue = parseInt(inputValue);
                      if (!isNaN(numValue)) {
                        const max = reservation.quantity;
                        // Permitir valores de 0 até o máximo, sem forçar mínimo de 1
                        const clampedValue = Math.max(0, Math.min(numValue, max));
                        setQuantityToLift(String(clampedValue));
                      }
                    }}
                    onBlur={(e) => {
                      // Se o campo ficar vazio ou for 0 ao perder foco, definir como 1
                      const value = parseInt(e.target.value);
                      if (e.target.value === "" || isNaN(value) || value < 1) {
                        setQuantityToLift("1");
                      }
                    }}
                    style={reservationsViewStyles.modalInput}
                  />
                </div>
                <div style={reservationsViewStyles.modalActions}>
                  <button
                    onClick={handleCloseModal}
                    style={reservationsViewStyles.modalCancelButton}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleLiftTickets}
                    disabled={updatingIds.has(selectedReservation) || !quantityToLift || parseInt(quantityToLift) < 1 || parseInt(quantityToLift) > reservation.quantity}
                    style={{
                      ...reservationsViewStyles.modalConfirmButton,
                      opacity: (updatingIds.has(selectedReservation) || !quantityToLift || parseInt(quantityToLift) < 1 || parseInt(quantityToLift) > reservation.quantity) ? 0.6 : 1,
                    }}
                  >
                    {updatingIds.has(selectedReservation) ? "A processar..." : "Confirmar"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Modal para reportar desperdício */}
        {showWasteReportModal && selectedMealForReport && (
          <div style={reservationsViewStyles.modalOverlay} onClick={handleCloseWasteReportModal}>
            <div style={reservationsViewStyles.wasteReportModal} onClick={(e) => e.stopPropagation()}>
              <h3 style={reservationsViewStyles.wasteReportModalTitle}>
                Reportar Desperdício - {selectedMealForReport.mealName}
              </h3>
              <div style={reservationsViewStyles.wasteReportModalInfo}>
                <p><strong>Refeições servidas:</strong> {selectedMealForReport.consumedQuantity} pratos</p>
                <p style={{ marginTop: "12px" }}>
                  Baseado na observação dos pratos recolhidos, quanto foi desperdiçado?
                </p>
              </div>
              <div style={reservationsViewStyles.wasteReportSliderContainer}>
                <div style={reservationsViewStyles.wasteReportSliderLabel}>
                  <span>Desperdício:</span>
                  <span style={reservationsViewStyles.wasteReportSliderValue}>{wastePercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={wastePercentage}
                  onChange={(e) => setWastePercentage(Number(e.target.value))}
                  style={{
                    ...reservationsViewStyles.wasteReportSlider,
                    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${wastePercentage}%, #e5e7eb ${wastePercentage}%, #e5e7eb 100%)`,
                  }}
                />
              </div>
              <div style={reservationsViewStyles.wasteReportExamples}>
                <div style={reservationsViewStyles.wasteReportExamplesTitle}>Exemplo:</div>
                <div>• 0% = Todos os pratos vazios</div>
                <div>• 50% = Metade da comida desperdiçada</div>
                <div>• 100% = Nenhum prato foi tocado</div>
              </div>
              <div style={reservationsViewStyles.modalActions}>
                <button
                  onClick={handleCloseWasteReportModal}
                  style={reservationsViewStyles.modalCancelButton}
                  disabled={reportingWaste}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitWasteReport}
                  disabled={reportingWaste}
                  style={{
                    ...reservationsViewStyles.modalConfirmButton,
                    opacity: reportingWaste ? 0.6 : 1,
                  }}
                >
                  {reportingWaste ? "A processar..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

