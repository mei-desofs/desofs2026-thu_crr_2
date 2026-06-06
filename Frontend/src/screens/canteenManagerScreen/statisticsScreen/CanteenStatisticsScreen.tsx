/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Bell, LogOut, ArrowLeft, Package, Calendar, ChevronLeft, ChevronRight, Table, PieChart, BarChart3 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { canteenStatisticsStyles } from './CanteenStatisticsScreen.styles';
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type FilterType = "day" | "week" | "dayOfWeek" | "month" | "year" | "all" | "dateRange";

const formatDateShort = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Função helper para obter segunda-feira da semana de uma data
const getMondayOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  // Se for domingo (0), subtrai 6 dias. Caso contrário, subtrai (day - 1) dias
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return monday;
};

// Função helper para renderizar calendário de semana (apenas segundas-feiras)
const renderWeekCalendar = (
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
    const dayOfWeek = currentDate.getDay();
    const isMonday = dayOfWeek === 1; // 1 = segunda-feira
    const mondayOfWeek = getMondayOfWeek(currentDate);
    const mondayStr = mondayOfWeek.toISOString().split('T')[0];
    const isSelected = selectedDate === mondayStr;

    days.push(
      <div
        key={i}
        onClick={() => {
          if (isMonday) {
            onDateSelect(dateStr);
          }
        }}
        onMouseEnter={(e) => {
          if (isMonday && !isSelected) {
            e.currentTarget.style.backgroundColor = "#374151";
          }
        }}
        onMouseLeave={(e) => {
          if (isMonday && !isSelected) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
        style={{
          ...canteenStatisticsStyles.calendarDay,
          ...(isCurrentMonth ? {} : canteenStatisticsStyles.calendarDayOtherMonth),
          ...(isMonday && isSelected ? canteenStatisticsStyles.calendarDaySelected : {}),
          ...(!isMonday ? { opacity: 0.3, cursor: 'not-allowed' } : { cursor: 'pointer' }),
        }}
      >
        {currentDate.getDate()}
      </div>
    );
  }

  return (
    <div style={canteenStatisticsStyles.calendarContainer} data-week-calendar-container>
      <div style={canteenStatisticsStyles.calendarHeader}>
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
          style={canteenStatisticsStyles.calendarNavButton}
        >
          <ChevronLeft size={16} />
        </button>
        <span style={canteenStatisticsStyles.calendarMonthYear}>
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
          style={canteenStatisticsStyles.calendarNavButton}
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div style={canteenStatisticsStyles.calendarGrid}>
        {["S", "T", "Q", "Q", "S", "S", "D"].map((day, idx) => (
          <div key={idx} style={canteenStatisticsStyles.calendarDayHeader as React.CSSProperties}>
            {day}
          </div>
        ))}
        {days}
      </div>
      <div style={{ padding: '8px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
        Selecione uma segunda-feira
      </div>
    </div>
  );
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
          ...canteenStatisticsStyles.calendarDay,
          ...(isCurrentMonth ? {} : canteenStatisticsStyles.calendarDayOtherMonth),
          ...(isSelected ? canteenStatisticsStyles.calendarDaySelected : {}),
        }}
      >
        {currentDate.getDate()}
      </div>
    );
  }

  return (
    <div style={canteenStatisticsStyles.calendarContainer} data-calendar-container>
      <div style={canteenStatisticsStyles.calendarHeader}>
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
          style={canteenStatisticsStyles.calendarNavButton}
        >
          <ChevronLeft size={16} />
        </button>
        <span style={canteenStatisticsStyles.calendarMonthYear}>
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
          style={canteenStatisticsStyles.calendarNavButton}
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div style={canteenStatisticsStyles.calendarGrid}>
        {["S", "T", "Q", "Q", "S", "S", "D"].map((day, idx) => (
          <div key={idx} style={canteenStatisticsStyles.calendarDayHeader as React.CSSProperties}>
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};

interface ProductionRecord {
  id: number;
  canteenId: number;
  dishId: number;
  date: string;
  refeitorioId: number;
  quantity: number;
  dish?: { 
    id: number; 
    name: string;
    dishTypeId?: number;
    dishType?: { id: number; name: string };
  };
  refeitorio?: { id: number; name: string };
  canteen?: { id: number; name: string };
}

interface ProductionStatistics {
  records: ProductionRecord[];
  totalQuantity: number;
  totalRecords: number;
}

export default function CanteenStatisticsScreen() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Utilizador";
  const [canteenName, setCanteenName] = useState<string>("Cantina");
  
  // Filtros de período
  const [filterType, setFilterType] = useState<FilterType>("day");
  const [dayFilter, setDayFilter] = useState<string>("");
  const [weekFilter, setWeekFilter] = useState<string>("");
  const [dayOfWeekFilter, setDayOfWeekFilter] = useState<number | null>(null);
  const [dayOfWeekStartDate, setDayOfWeekStartDate] = useState<string>("");
  const [dayOfWeekEndDate, setDayOfWeekEndDate] = useState<string>("");
  const [dateRangeStart, setDateRangeStart] = useState<string>("");
  const [dateRangeEnd, setDateRangeEnd] = useState<string>("");
  const [monthFilter, setMonthFilter] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("");
  
  // Calendários
  const [showDayCalendar, setShowDayCalendar] = useState(false);
  const [showWeekCalendar, setShowWeekCalendar] = useState(false);
  const [showDayOfWeekStartCalendar, setShowDayOfWeekStartCalendar] = useState(false);
  const [showDayOfWeekEndCalendar, setShowDayOfWeekEndCalendar] = useState(false);
  const [showDateRangeStartCalendar, setShowDateRangeStartCalendar] = useState(false);
  const [showDateRangeEndCalendar, setShowDateRangeEndCalendar] = useState(false);
  const [dayCalendarMonth, setDayCalendarMonth] = useState(new Date().getMonth());
  const [dayCalendarYear, setDayCalendarYear] = useState(new Date().getFullYear());
  const [weekCalendarMonth, setWeekCalendarMonth] = useState(new Date().getMonth());
  const [weekCalendarYear, setWeekCalendarYear] = useState(new Date().getFullYear());
  const [dayOfWeekStartCalendarMonth, setDayOfWeekStartCalendarMonth] = useState(new Date().getMonth());
  const [dayOfWeekStartCalendarYear, setDayOfWeekStartCalendarYear] = useState(new Date().getFullYear());
  const [dayOfWeekEndCalendarMonth, setDayOfWeekEndCalendarMonth] = useState(new Date().getMonth());
  const [dayOfWeekEndCalendarYear, setDayOfWeekEndCalendarYear] = useState(new Date().getFullYear());
  const [dateRangeStartCalendarMonth, setDateRangeStartCalendarMonth] = useState(new Date().getMonth());
  const [dateRangeStartCalendarYear, setDateRangeStartCalendarYear] = useState(new Date().getFullYear());
  const [dateRangeEndCalendarMonth, setDateRangeEndCalendarMonth] = useState(new Date().getMonth());
  const [dateRangeEndCalendarYear, setDateRangeEndCalendarYear] = useState(new Date().getFullYear());
  
  const [statistics, setStatistics] = useState<ProductionStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRefeitorioId, setSelectedRefeitorioId] = useState<string>("all");
  const [refeitorios, setRefeitorios] = useState<Array<{ id: number; name: string }>>([]);
  
  // Estados para ingredientes
  const [ingredientsStatistics, setIngredientsStatistics] = useState<any>(null);
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [dishTypes, setDishTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedDishTypeId, setSelectedDishTypeId] = useState<string>("all");

  // Buscar refeitórios associados à cantina
  useEffect(() => {
    const fetchRefeitorios = async () => {
      if (!user?.canteenId) return;

      try {
        const response = await axios.get<Array<{ id: number; name: string }>>(
          `${API_BASE_URL}/canteens/${user.canteenId}/refeitorios`
        );
        setRefeitorios(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar refeitórios:", err);
      }
    };

    if (user?.canteenId) {
      fetchRefeitorios();
    }
  }, [user?.canteenId]);

  // Buscar tipos de prato
  useEffect(() => {
    const fetchDishTypes = async () => {
      try {
        const response = await axios.get<Array<{ id: number; name: string }>>(
          `${API_BASE_URL}/auxiliar/dish-type`
        );
        setDishTypes(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar tipos de prato:", err);
      }
    };

    fetchDishTypes();
  }, []);

  // Buscar estatísticas de produção
  const loadStatistics = useCallback(async () => {
    if (!user?.canteenId) return;

    // Verificar se os filtros necessários estão preenchidos
    const hasRequiredFilters = 
      (filterType === "day" && dayFilter) ||
      (filterType === "week" && weekFilter) ||
      (filterType === "dayOfWeek" && dayOfWeekFilter !== null && dayOfWeekStartDate && dayOfWeekEndDate) ||
      (filterType === "month" && monthFilter) ||
      (filterType === "year" && yearFilter) ||
      (filterType === "dateRange" && dateRangeStart && dateRangeEnd) ||
      (filterType === "all");

    // Se não tiver os filtros necessários, limpar dados e não fazer chamada
    if (!hasRequiredFilters) {
      setStatistics(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      
      if (filterType === "day" && dayFilter) {
        params.date = dayFilter;
        params.period = "day";
      } else if (filterType === "week" && weekFilter) {
        // Calcular início (segunda-feira) e fim (domingo) da semana
        const monday = new Date(weekFilter);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        params.dateRangeStart = weekFilter;
        params.dateRangeEnd = sunday.toISOString().split('T')[0];
        params.period = "week";
      } else if (filterType === "dayOfWeek" && dayOfWeekFilter !== null && dayOfWeekStartDate && dayOfWeekEndDate) {
        // dayOfWeek: 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado
        params.dayOfWeek = dayOfWeekFilter;
        params.dateRangeStart = dayOfWeekStartDate;
        params.dateRangeEnd = dayOfWeekEndDate;
      } else if (filterType === "month" && monthFilter) {
        const monthDate = monthFilter + "-01";
        params.date = monthDate;
        params.period = "month";
      } else if (filterType === "year" && yearFilter) {
        params.date = yearFilter + "-01-01";
        params.period = "year";
      } else if (filterType === "dateRange" && dateRangeStart && dateRangeEnd) {
        params.dateRangeStart = dateRangeStart;
        params.dateRangeEnd = dateRangeEnd;
      } else if (filterType === "all") {
        // Não adicionar filtros de data - mostrar todos os dados
      }
      
      if (selectedRefeitorioId && selectedRefeitorioId !== "all") {
        params.refeitorioId = selectedRefeitorioId;
      }

      if (selectedDishTypeId && selectedDishTypeId !== "all") {
        params.dishTypeId = selectedDishTypeId;
      }

      const response = await axios.get<ProductionStatistics>(
        `${API_BASE_URL}/canteens/${user.canteenId}/production-statistics`,
        { params }
      );
      setStatistics(response.data);
    } catch (err: any) {
      console.error("Erro ao buscar estatísticas:", err);
      setError("Não foi possível carregar as estatísticas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [user?.canteenId, filterType, dayFilter, weekFilter, dayOfWeekFilter, dayOfWeekStartDate, dayOfWeekEndDate, dateRangeStart, dateRangeEnd, monthFilter, yearFilter, selectedRefeitorioId, selectedDishTypeId]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  // Buscar estatísticas de ingredientes
  const loadIngredientsStatistics = useCallback(async () => {
    if (!user?.canteenId) return;

    // Verificar se os filtros necessários estão preenchidos
    const hasRequiredFilters = 
      (filterType === "day" && dayFilter) ||
      (filterType === "week" && weekFilter) ||
      (filterType === "dayOfWeek" && dayOfWeekFilter !== null && dayOfWeekStartDate && dayOfWeekEndDate) ||
      (filterType === "month" && monthFilter) ||
      (filterType === "year" && yearFilter) ||
      (filterType === "dateRange" && dateRangeStart && dateRangeEnd) ||
      (filterType === "all");

    if (!hasRequiredFilters) {
      setIngredientsStatistics(null);
      return;
    }

    setLoadingIngredients(true);
    try {
      const params: any = {};
      
      if (filterType === "day" && dayFilter) {
        params.date = dayFilter;
        params.period = "day";
      } else if (filterType === "week" && weekFilter) {
        const monday = new Date(weekFilter);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        params.dateRangeStart = weekFilter;
        params.dateRangeEnd = sunday.toISOString().split('T')[0];
        params.period = "week";
      } else if (filterType === "dayOfWeek" && dayOfWeekFilter !== null && dayOfWeekStartDate && dayOfWeekEndDate) {
        params.dayOfWeek = dayOfWeekFilter;
        params.dateRangeStart = dayOfWeekStartDate;
        params.dateRangeEnd = dayOfWeekEndDate;
      } else if (filterType === "month" && monthFilter) {
        const monthDate = monthFilter + "-01";
        params.date = monthDate;
        params.period = "month";
      } else if (filterType === "year" && yearFilter) {
        params.date = yearFilter + "-01-01";
        params.period = "year";
      } else if (filterType === "dateRange" && dateRangeStart && dateRangeEnd) {
        params.dateRangeStart = dateRangeStart;
        params.dateRangeEnd = dateRangeEnd;
      }
      
      if (selectedRefeitorioId && selectedRefeitorioId !== "all") {
        params.refeitorioId = selectedRefeitorioId;
      }

      if (selectedDishTypeId && selectedDishTypeId !== "all") {
        params.dishTypeId = selectedDishTypeId;
      }

      const response = await axios.get(
        `${API_BASE_URL}/canteens/${user.canteenId}/ingredients-statistics`,
        { params }
      );
      setIngredientsStatistics(response.data);
    } catch (err: any) {
      console.error("Erro ao buscar estatísticas de ingredientes:", err);
    } finally {
      setLoadingIngredients(false);
    }
  }, [user?.canteenId, filterType, dayFilter, weekFilter, dayOfWeekFilter, dayOfWeekStartDate, dayOfWeekEndDate, dateRangeStart, dateRangeEnd, monthFilter, yearFilter, selectedRefeitorioId, selectedDishTypeId]);

  useEffect(() => {
    loadIngredientsStatistics();
  }, [loadIngredientsStatistics]);

  useEffect(() => {
    if (dayFilter) {
      const date = new Date(dayFilter);
      setDayCalendarMonth(date.getMonth());
      setDayCalendarYear(date.getFullYear());
    }
  }, [dayFilter]);

  useEffect(() => {
    if (weekFilter) {
      const date = new Date(weekFilter);
      setWeekCalendarMonth(date.getMonth());
      setWeekCalendarYear(date.getFullYear());
    }
  }, [weekFilter]);

  useEffect(() => {
    if (dayOfWeekStartDate) {
      const date = new Date(dayOfWeekStartDate);
      setDayOfWeekStartCalendarMonth(date.getMonth());
      setDayOfWeekStartCalendarYear(date.getFullYear());
    }
  }, [dayOfWeekStartDate]);

  useEffect(() => {
    if (dayOfWeekEndDate) {
      const date = new Date(dayOfWeekEndDate);
      setDayOfWeekEndCalendarMonth(date.getMonth());
      setDayOfWeekEndCalendarYear(date.getFullYear());
    }
  }, [dayOfWeekEndDate]);

  useEffect(() => {
    if (dateRangeStart) {
      const date = new Date(dateRangeStart);
      setDateRangeStartCalendarMonth(date.getMonth());
      setDateRangeStartCalendarYear(date.getFullYear());
    }
  }, [dateRangeStart]);

  useEffect(() => {
    if (dateRangeEnd) {
      const date = new Date(dateRangeEnd);
      setDateRangeEndCalendarMonth(date.getMonth());
      setDateRangeEndCalendarYear(date.getFullYear());
    }
  }, [dateRangeEnd]);

  // Fechar calendário ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDayCalendar && !target.closest('[data-calendar-container]')) {
        setShowDayCalendar(false);
      }
      if (showWeekCalendar && !target.closest('[data-week-calendar-container]')) {
        setShowWeekCalendar(false);
      }
      if (showDayOfWeekStartCalendar && !target.closest('[data-dayofweek-start-calendar-container]')) {
        setShowDayOfWeekStartCalendar(false);
      }
      if (showDayOfWeekEndCalendar && !target.closest('[data-dayofweek-end-calendar-container]')) {
        setShowDayOfWeekEndCalendar(false);
      }
      if (showDateRangeStartCalendar && !target.closest('[data-daterange-start-calendar-container]')) {
        setShowDateRangeStartCalendar(false);
      }
      if (showDateRangeEndCalendar && !target.closest('[data-daterange-end-calendar-container]')) {
        setShowDateRangeEndCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDayCalendar, showWeekCalendar, showDayOfWeekStartCalendar, showDayOfWeekEndCalendar, showDateRangeStartCalendar, showDateRangeEndCalendar]);

  // Buscar nome da cantina
  useEffect(() => {
    const fetchCanteenName = async () => {
      if (user?.canteen?.name) {
        setCanteenName(user.canteen.name);
        return;
      }
      
      if (user?.canteenId) {
        try {
          const response = await axios.get(`${API_BASE_URL}/canteens/${user.canteenId}`);
          if (response.data?.name) {
            setCanteenName(response.data.name);
          }
        } catch (err) {
          console.error("Erro ao buscar nome da cantina:", err);
        }
      }
    };

    if (user) {
      fetchCanteenName();
    }
  }, [user?.canteenId, user?.canteen?.name, user]);


  const handleBack = () => {
    navigate("/canteenmanager-dashboard");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div style={canteenStatisticsStyles.pageContainer}>
      {/* Header */}
      <header style={canteenStatisticsStyles.header}>
        <div style={canteenStatisticsStyles.headerLeft}>
          <button
            style={canteenStatisticsStyles.backButton}
            onClick={handleBack}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <div style={canteenStatisticsStyles.headerInfo}>
            <h1 style={canteenStatisticsStyles.headerTitle}>BioCantinas</h1>
            <p style={canteenStatisticsStyles.headerSubtitle}>
              {canteenName} - {userName}
            </p>
          </div>
        </div>
        <div style={canteenStatisticsStyles.headerActions}>
          <button 
            style={canteenStatisticsStyles.iconButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell size={20} />
          </button>
          <button 
            style={canteenStatisticsStyles.iconButton} 
            onClick={handleLogout}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={canteenStatisticsStyles.mainContent}>
        <div style={canteenStatisticsStyles.contentWrapper}>
          <div style={canteenStatisticsStyles.titleSection}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h2 style={canteenStatisticsStyles.pageTitle}>
                <Package size={28} style={{ marginRight: '12px' }} />
                Estatísticas da Cantina
              </h2>
              {canteenName && (
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#111827',
                  border: '1px solid #e5e7eb'
                }}>
                  {canteenName}
                </div>
              )}
            </div>
            <p style={canteenStatisticsStyles.pageDescription}>
              Visualize os KPIs da cantina, incluindo pratos produzidos, quantidade de ingredientes utilizados e outros indicadores de produção.
            </p>
          </div>

          {/* Filtros */}
          <div style={canteenStatisticsStyles.filtersContainer}>
            <div style={canteenStatisticsStyles.filterGroup}>
              <label style={canteenStatisticsStyles.filterLabel} htmlFor="period-filter">Período:</label>
              <select
                id="period-filter"
                value={filterType}
                onChange={(e) => {
                  const newFilterType = e.target.value as FilterType;
                  setFilterType(newFilterType);
                  setDayFilter("");
                  setWeekFilter("");
                  setDayOfWeekFilter(null);
                  setDayOfWeekStartDate("");
                  setDayOfWeekEndDate("");
                  setDateRangeStart("");
                  setDateRangeEnd("");
                  setMonthFilter("");
                  setYearFilter("");
                }}
                style={canteenStatisticsStyles.selectFilter}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#16a34a';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="day">Por Dia</option>
                <option value="week">Por Semana</option>
                <option value="dayOfWeek">Por Dia da Semana</option>
                <option value="month">Por Mês</option>
                <option value="year">Por Ano</option>
                <option value="dateRange">Por Intervalo</option>
                <option value="all">Sempre</option>
              </select>
            </div>

            {/* Filtro para Dia */}
            {filterType === "day" && (
              <div style={canteenStatisticsStyles.filterGroup}>
                <label style={canteenStatisticsStyles.filterLabel} htmlFor="day-filter">Dia:</label>
                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-calendar-container>
                  <div 
                    style={canteenStatisticsStyles.filterWrapper}
                    onClick={() => setShowDayCalendar(!showDayCalendar)}
                  >
                    <Calendar size={16} />
                    <span style={{
                      ...canteenStatisticsStyles.dateButtonText,
                      color: dayFilter ? "#111827" : "#9ca3af",
                    }}>
                      {dayFilter ? formatDateShort(dayFilter) : "Selecionar dia..."}
                    </span>
                    {dayFilter && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDayFilter("");
                        }}
                        style={canteenStatisticsStyles.clearDateButton}
                        aria-label="Limpar filtro de data"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  {showDayCalendar && renderCalendar(
                    dayCalendarYear,
                    dayCalendarMonth,
                    dayFilter,
                    (dateStr) => {
                      setDayFilter(dateStr);
                      setShowDayCalendar(false);
                    },
                    (newMonth, newYear) => {
                      setDayCalendarMonth(newMonth);
                      setDayCalendarYear(newYear);
                    }
                  )}
                </div>
              </div>
            )}

            {/* Filtro para Semana */}
            {filterType === "week" && (
              <div style={canteenStatisticsStyles.filterGroup}>
                <label style={canteenStatisticsStyles.filterLabel} htmlFor="week-filter">Semana:</label>
                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-week-calendar-container>
                  <div 
                    style={canteenStatisticsStyles.filterWrapper}
                    onClick={() => setShowWeekCalendar(!showWeekCalendar)}
                  >
                    <Calendar size={16} />
                    <span style={{
                      ...canteenStatisticsStyles.dateButtonText,
                      color: weekFilter ? "#111827" : "#9ca3af",
                    }}>
                      {weekFilter ? (() => {
                        const monday = new Date(weekFilter);
                        const sunday = new Date(monday);
                        sunday.setDate(monday.getDate() + 6);
                        return `${formatDateShort(weekFilter)} - ${formatDateShort(sunday.toISOString().split('T')[0])}`;
                      })() : "Selecionar segunda-feira..."}
                    </span>
                    {weekFilter && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setWeekFilter("");
                        }}
                        style={canteenStatisticsStyles.clearDateButton}
                        aria-label="Limpar filtro de semana"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  {showWeekCalendar && renderWeekCalendar(
                    weekCalendarYear,
                    weekCalendarMonth,
                    weekFilter,
                    (dateStr) => {
                      // Garantir que é segunda-feira
                      const selectedDate = new Date(dateStr);
                      const monday = getMondayOfWeek(selectedDate);
                      setWeekFilter(monday.toISOString().split('T')[0]);
                      setShowWeekCalendar(false);
                    },
                    (newMonth, newYear) => {
                      setWeekCalendarMonth(newMonth);
                      setWeekCalendarYear(newYear);
                    }
                  )}
                </div>
              </div>
            )}

            {/* Filtro para Dia da Semana */}
            {filterType === "dayOfWeek" && (
              <>
                <div style={canteenStatisticsStyles.filterGroup}>
                  <label style={canteenStatisticsStyles.filterLabel} htmlFor="dayOfWeek-filter">Dia da Semana:</label>
                  <select
                    id="dayOfWeek-filter"
                    value={dayOfWeekFilter !== null ? dayOfWeekFilter : ""}
                    onChange={(e) => setDayOfWeekFilter(e.target.value ? parseInt(e.target.value) : null)}
                    style={canteenStatisticsStyles.selectFilter}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#16a34a';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Selecionar dia da semana...</option>
                    <option value="1">Segundas-feiras</option>
                    <option value="2">Terças-feiras</option>
                    <option value="3">Quartas-feiras</option>
                    <option value="4">Quintas-feiras</option>
                    <option value="5">Sextas-feiras</option>
                    <option value="6">Sábados</option>
                    <option value="0">Domingos</option>
                  </select>
                </div>
                <div style={canteenStatisticsStyles.filterGroup}>
                  <label style={canteenStatisticsStyles.filterLabel} htmlFor="dayOfWeek-start-date">Data Início:</label>
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-dayofweek-start-calendar-container>
                    <div 
                      style={canteenStatisticsStyles.filterWrapper}
                      onClick={() => setShowDayOfWeekStartCalendar(!showDayOfWeekStartCalendar)}
                    >
                      <Calendar size={16} />
                      <span style={{
                        ...canteenStatisticsStyles.dateButtonText,
                        color: dayOfWeekStartDate ? "#111827" : "#9ca3af",
                      }}>
                        {dayOfWeekStartDate ? formatDateShort(dayOfWeekStartDate) : "Selecionar data..."}
                      </span>
                    </div>
                    {showDayOfWeekStartCalendar && renderCalendar(
                      dayOfWeekStartCalendarYear,
                      dayOfWeekStartCalendarMonth,
                      dayOfWeekStartDate,
                      (dateStr) => {
                        setDayOfWeekStartDate(dateStr);
                        setShowDayOfWeekStartCalendar(false);
                      },
                      (newMonth, newYear) => {
                        setDayOfWeekStartCalendarMonth(newMonth);
                        setDayOfWeekStartCalendarYear(newYear);
                      }
                    )}
                  </div>
                </div>
                <div style={{...canteenStatisticsStyles.filterGroup, marginLeft: '24px'}}>
                  <label style={canteenStatisticsStyles.filterLabel} htmlFor="dayOfWeek-end-date">Data Fim:</label>
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-dayofweek-end-calendar-container>
                    <div 
                      style={canteenStatisticsStyles.filterWrapper}
                      onClick={() => setShowDayOfWeekEndCalendar(!showDayOfWeekEndCalendar)}
                    >
                      <Calendar size={16} />
                      <span style={{
                        ...canteenStatisticsStyles.dateButtonText,
                        color: dayOfWeekEndDate ? "#111827" : "#9ca3af",
                      }}>
                        {dayOfWeekEndDate ? formatDateShort(dayOfWeekEndDate) : "Selecionar data..."}
                      </span>
                    </div>
                    {showDayOfWeekEndCalendar && renderCalendar(
                      dayOfWeekEndCalendarYear,
                      dayOfWeekEndCalendarMonth,
                      dayOfWeekEndDate,
                      (dateStr) => {
                        setDayOfWeekEndDate(dateStr);
                        setShowDayOfWeekEndCalendar(false);
                      },
                      (newMonth, newYear) => {
                        setDayOfWeekEndCalendarMonth(newMonth);
                        setDayOfWeekEndCalendarYear(newYear);
                      }
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Filtro para Mês */}
            {filterType === "month" && (
              <div style={canteenStatisticsStyles.filterGroup}>
                <label style={canteenStatisticsStyles.filterLabel} htmlFor="month-filter">Mês:</label>
                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                  <select
                    id="month-filter"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    style={canteenStatisticsStyles.selectFilter}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#16a34a';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Selecionar mês...</option>
                    {(() => {
                      const months = [];
                      const currentYear = new Date().getFullYear();
                      for (let yearOffset = -1; yearOffset <= 1; yearOffset++) {
                        const year = currentYear + yearOffset;
                        for (let month = 0; month < 12; month++) {
                          const date = new Date(year, month, 1);
                          const monthValue = `${year}-${String(month + 1).padStart(2, '0')}`;
                          const monthName = date.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });
                          months.push(
                            <option key={monthValue} value={monthValue}>
                              {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                            </option>
                          );
                        }
                      }
                      return months;
                    })()}
                  </select>
                  {monthFilter && (
                    <button
                      onClick={() => setMonthFilter("")}
                      style={{
                        ...canteenStatisticsStyles.clearDateButton,
                        position: 'absolute',
                        right: '36px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                      aria-label="Limpar mês"
                      title="Limpar mês"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Filtro para Ano */}
            {filterType === "year" && (
              <div style={canteenStatisticsStyles.filterGroup}>
                <label style={canteenStatisticsStyles.filterLabel} htmlFor="year-filter">Ano:</label>
                <select
                  id="year-filter"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  style={canteenStatisticsStyles.selectFilter}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#16a34a';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Selecionar ano...</option>
                  {(() => {
                    const years = [];
                    const currentYear = new Date().getFullYear();
                    for (let yearOffset = -2; yearOffset <= 2; yearOffset++) {
                      const year = currentYear + yearOffset;
                      years.push(
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    }
                    return years;
                  })()}
                </select>
              </div>
            )}

            {/* Filtro para Por Intervalo */}
            {filterType === "dateRange" && (
              <>
                <div style={canteenStatisticsStyles.filterGroup}>
                  <label style={canteenStatisticsStyles.filterLabel} htmlFor="dateRange-start-date">Data Início:</label>
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-daterange-start-calendar-container>
                    <div 
                      style={canteenStatisticsStyles.filterWrapper}
                      onClick={() => setShowDateRangeStartCalendar(!showDateRangeStartCalendar)}
                    >
                      <Calendar size={16} />
                      <span style={{
                        ...canteenStatisticsStyles.dateButtonText,
                        color: dateRangeStart ? "#111827" : "#9ca3af",
                      }}>
                        {dateRangeStart ? formatDateShort(dateRangeStart) : "Selecionar data..."}
                      </span>
                    </div>
                    {showDateRangeStartCalendar && renderCalendar(
                      dateRangeStartCalendarYear,
                      dateRangeStartCalendarMonth,
                      dateRangeStart,
                      (dateStr) => {
                        setDateRangeStart(dateStr);
                        setShowDateRangeStartCalendar(false);
                      },
                      (newMonth, newYear) => {
                        setDateRangeStartCalendarMonth(newMonth);
                        setDateRangeStartCalendarYear(newYear);
                      }
                    )}
                  </div>
                </div>
                <div style={{...canteenStatisticsStyles.filterGroup, marginLeft: '24px'}}>
                  <label style={canteenStatisticsStyles.filterLabel} htmlFor="dateRange-end-date">Data Fim:</label>
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-daterange-end-calendar-container>
                    <div 
                      style={canteenStatisticsStyles.filterWrapper}
                      onClick={() => setShowDateRangeEndCalendar(!showDateRangeEndCalendar)}
                    >
                      <Calendar size={16} />
                      <span style={{
                        ...canteenStatisticsStyles.dateButtonText,
                        color: dateRangeEnd ? "#111827" : "#9ca3af",
                      }}>
                        {dateRangeEnd ? formatDateShort(dateRangeEnd) : "Selecionar data..."}
                      </span>
                    </div>
                    {showDateRangeEndCalendar && renderCalendar(
                      dateRangeEndCalendarYear,
                      dateRangeEndCalendarMonth,
                      dateRangeEnd,
                      (dateStr) => {
                        setDateRangeEnd(dateStr);
                        setShowDateRangeEndCalendar(false);
                      },
                      (newMonth, newYear) => {
                        setDateRangeEndCalendarMonth(newMonth);
                        setDateRangeEndCalendarYear(newYear);
                      }
                    )}
                  </div>
                </div>
              </>
            )}

            <div style={canteenStatisticsStyles.filterGroup}>
              <label style={canteenStatisticsStyles.filterLabel} htmlFor="refeitorio-filter">Refeitório:</label>
              <select
                id="refeitorio-filter"
                value={selectedRefeitorioId}
                onChange={(e) => setSelectedRefeitorioId(e.target.value)}
                style={canteenStatisticsStyles.selectFilter}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#16a34a';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="all">Todos os Refeitórios</option>
                {refeitorios.map((refeitorio) => (
                  <option key={refeitorio.id} value={refeitorio.id}>
                    {refeitorio.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={canteenStatisticsStyles.filterGroup}>
              <label style={canteenStatisticsStyles.filterLabel} htmlFor="dishType-filter">Tipo de Prato:</label>
              <select
                id="dishType-filter"
                value={selectedDishTypeId}
                onChange={(e) => setSelectedDishTypeId(e.target.value)}
                style={canteenStatisticsStyles.selectFilter}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#16a34a';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="all">Todos os Tipos</option>
                {dishTypes.map((dishType) => (
                  <option key={dishType.id} value={dishType.id}>
                    {dishType.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Verificar se há filtros selecionados */}
          {(() => {
            const hasRequiredFilters = 
              (filterType === "day" && dayFilter) ||
              (filterType === "week" && weekFilter) ||
              (filterType === "dayOfWeek" && dayOfWeekFilter !== null && dayOfWeekStartDate && dayOfWeekEndDate) ||
              (filterType === "month" && monthFilter) ||
              (filterType === "year" && yearFilter) ||
              (filterType === "dateRange" && dateRangeStart && dateRangeEnd) ||
              (filterType === "all");
            return hasRequiredFilters;
          })() && statistics && (
            <>
          {/* Cards de Resumo */}
          {statistics && (
            <div style={canteenStatisticsStyles.statsContainer}>
              <div style={canteenStatisticsStyles.statCard}>
                <div style={canteenStatisticsStyles.statCardHeader}>
                  <div style={canteenStatisticsStyles.statIcon}>
                    <Package size={32} color="#16a34a" />
                  </div>
                  <h3 style={canteenStatisticsStyles.statCardTitle}>Total de Pratos Produzidos</h3>
                </div>
                <div style={canteenStatisticsStyles.statCardContent}>
                  <div style={canteenStatisticsStyles.statValue}>
                    {statistics.totalQuantity.toLocaleString('pt-PT')}
                  </div>
                  <p style={canteenStatisticsStyles.statDescription}>
                    Total de pratos produzidos
                  </p>
                </div>
              </div>

              <div style={canteenStatisticsStyles.statCard}>
                <div style={canteenStatisticsStyles.statCardHeader}>
                  <div style={canteenStatisticsStyles.statIcon}>
                    <Table size={32} color="#16a34a" />
                  </div>
                  <h3 style={canteenStatisticsStyles.statCardTitle}>Pedidos Processados</h3>
                </div>
                <div style={canteenStatisticsStyles.statCardContent}>
                  <div style={canteenStatisticsStyles.statValue}>
                    {statistics.totalRecords}
                  </div>
                  <p style={canteenStatisticsStyles.statDescription}>
                    Total de pedidos processados
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Gráficos */}
          {statistics && statistics.records.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
              gap: '24px',
              marginTop: '32px'
            }}>
              {/* Gráfico de Pizza - Distribuição por Tipo de Prato */}
              {(() => {
                // Agrupar por tipo de prato
                const dishTypeData: { [key: string]: { name: string; value: number; color: string } } = {};
                
                // Usar dados de ingredientsStatistics se disponível (mais preciso)
                if (ingredientsStatistics && ingredientsStatistics.byDishType) {
                  ingredientsStatistics.byDishType.forEach((group: any) => {
                    dishTypeData[group.dishTypeId] = {
                      name: group.dishTypeName,
                      value: group.totalDishes,
                      color: group.dishTypeId === 1 ? '#ef4444' : group.dishTypeId === 2 ? '#3b82f6' : '#10b981'
                    };
                  });
                } else {
                  // Fallback: processar dados de statistics.records
                  statistics.records.forEach((record: ProductionRecord) => {
                    const dishTypeId = record.dish?.dishTypeId;
                    const dishTypeName = record.dish?.dishType?.name || dishTypes.find(dt => dt.id === dishTypeId)?.name || `Tipo ${dishTypeId}`;
                    
                    if (dishTypeId) {
                      if (!dishTypeData[dishTypeId]) {
                        dishTypeData[dishTypeId] = {
                          name: dishTypeName,
                          value: 0,
                          color: dishTypeId === 1 ? '#ef4444' : dishTypeId === 2 ? '#3b82f6' : '#10b981'
                        };
                      }
                      dishTypeData[dishTypeId].value += record.quantity;
                    }
                  });
                }

                const pieData = Object.values(dishTypeData).filter(item => item.value > 0);

                if (pieData.length === 0) return null;

                return (
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#111827',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <PieChart size={20} />
                      Distribuição por Tipo de Prato
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value} pratos`} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                );
              })()}

              {/* Gráfico de Barras - Top Pratos Mais Produzidos */}
              {(() => {
                // Agrupar pratos por nome e somar quantidades
                const dishMap: { [key: string]: number } = {};
                
                statistics.records.forEach((record: any) => {
                  const dishName = record.dish?.name || `Prato ID: ${record.dishId}`;
                  dishMap[dishName] = (dishMap[dishName] || 0) + record.quantity;
                });

                // Converter para array e ordenar por quantidade (top 10)
                const barData = Object.entries(dishMap)
                  .map(([name, value]) => ({ name, quantidade: value }))
                  .sort((a, b) => b.quantidade - a.quantidade)
                  .slice(0, 10);

                if (barData.length === 0) return null;

                return (
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#111827',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <BarChart3 size={20} />
                      Top Pratos Mais Produzidos
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `${value} pratos`} />
                        <Legend />
                        <Bar dataKey="quantidade" fill="#16a34a" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Tabela de Produção */}
          {loading ? (
            <div style={canteenStatisticsStyles.loadingContainer}>
              <p>A carregar dados...</p>
            </div>
          ) : error ? (
            <div style={canteenStatisticsStyles.errorContainer}>
              <p>{error}</p>
            </div>
          ) : !(() => {
            const hasRequiredFilters = 
              (filterType === "day" && dayFilter) ||
              (filterType === "week" && weekFilter) ||
              (filterType === "dayOfWeek" && dayOfWeekFilter !== null && dayOfWeekStartDate && dayOfWeekEndDate) ||
              (filterType === "month" && monthFilter) ||
              (filterType === "year" && yearFilter) ||
              (filterType === "dateRange" && dateRangeStart && dateRangeEnd) ||
              (filterType === "all");
            return hasRequiredFilters;
          })() ? (
            <div style={canteenStatisticsStyles.noDataContainer}>
              <p>Por favor, selecione um período para ver os pedidos realizados.</p>
            </div>
          ) : statistics && statistics.records.length > 0 ? (
            <div style={canteenStatisticsStyles.tableContainer}>
              <div style={canteenStatisticsStyles.tableCard}>
                <h3 style={canteenStatisticsStyles.tableTitle}>
                  <Table size={20} style={{ marginRight: '8px' }} />
                  Pedidos Realizados
                </h3>
                <div style={canteenStatisticsStyles.tableWrapper}>
                  <table style={canteenStatisticsStyles.table}>
                    <thead>
                      <tr>
                        <th style={canteenStatisticsStyles.tableHeader}>Prato</th>
                        <th style={canteenStatisticsStyles.tableHeader}>Data</th>
                        <th style={canteenStatisticsStyles.tableHeader}>Refeitório</th>
                        <th style={canteenStatisticsStyles.tableHeader}>Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statistics.records.map((record) => (
                        <tr 
                          key={record.id} 
                          style={canteenStatisticsStyles.tableRow}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td style={canteenStatisticsStyles.tableCell}>
                            {record.dish?.name || `Prato ID: ${record.dishId}`}
                          </td>
                          <td style={canteenStatisticsStyles.tableCell}>
                            {formatDateShort(record.date)}
                          </td>
                          <td style={canteenStatisticsStyles.tableCell}>
                            {record.refeitorio?.name || `Refeitório ID: ${record.refeitorioId}`}
                          </td>
                          <td style={{ ...canteenStatisticsStyles.tableCell, fontWeight: 600, color: '#16a34a' }}>
                            {record.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div style={canteenStatisticsStyles.noDataContainer}>
              <p>Não há registos de produção para o período selecionado.</p>
            </div>
          )}
            </>
          )}

          {/* Seção de Ingredientes Utilizados */}
          {(() => {
            const hasRequiredFilters = 
              (filterType === "day" && dayFilter) ||
              (filterType === "week" && weekFilter) ||
              (filterType === "dayOfWeek" && dayOfWeekFilter !== null && dayOfWeekStartDate && dayOfWeekEndDate) ||
              (filterType === "month" && monthFilter) ||
              (filterType === "year" && yearFilter) ||
              (filterType === "dateRange" && dateRangeStart && dateRangeEnd) ||
              (filterType === "all");
            return hasRequiredFilters;
          })() && (
            <>
              {loadingIngredients ? (
                <div style={canteenStatisticsStyles.loadingContainer}>
                  <p>A carregar dados de ingredientes...</p>
                </div>
              ) : ingredientsStatistics && ingredientsStatistics.byDishType && ingredientsStatistics.byDishType.length > 0 ? (
                <div style={{ marginTop: '32px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Package size={20} />
                    Ingredientes Utilizados
                  </h3>
                  
                  {ingredientsStatistics.byDishType.map((dishTypeGroup: any) => (
                    <div key={dishTypeGroup.dishTypeId} style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '16px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        paddingBottom: '12px',
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        <h4 style={{
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#111827',
                          margin: 0
                        }}>
                          {dishTypeGroup.dishTypeName}
                        </h4>
                        <span style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          fontWeight: 500
                        }}>
                          {dishTypeGroup.totalDishes} pratos produzidos
                        </span>
                      </div>
                      
                      {dishTypeGroup.ingredients && dishTypeGroup.ingredients.length > 0 ? (
                        <div style={canteenStatisticsStyles.tableWrapper}>
                          <table style={canteenStatisticsStyles.table}>
                            <thead>
                              <tr>
                                <th style={canteenStatisticsStyles.tableHeader}>Produto</th>
                                <th style={canteenStatisticsStyles.tableHeader}>Quantidade</th>
                                <th style={canteenStatisticsStyles.tableHeader}>Unidade</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dishTypeGroup.ingredients.map((ingredient: any, idx: number) => (
                                <tr 
                                  key={`${ingredient.productId}-${ingredient.unitId}-${idx}`}
                                  style={canteenStatisticsStyles.tableRow}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <td style={canteenStatisticsStyles.tableCell}>
                                    {ingredient.productName}
                                  </td>
                                  <td style={{ ...canteenStatisticsStyles.tableCell, fontWeight: 600, color: '#16a34a' }}>
                                    {ingredient.totalQuantity.toLocaleString('pt-PT', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    })}
                                  </td>
                                  <td style={canteenStatisticsStyles.tableCell}>
                                    {ingredient.unitName}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                          Nenhum ingrediente encontrado para este tipo de prato.
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {ingredientsStatistics.summary && (
                    <div style={{
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      padding: '16px',
                      marginTop: '16px',
                      display: 'flex',
                      gap: '24px',
                      flexWrap: 'wrap'
                    }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Total de Tipos de Prato: </span>
                        <strong style={{ color: '#111827' }}>{ingredientsStatistics.summary.totalDishTypes}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Total de Produtos: </span>
                        <strong style={{ color: '#111827' }}>{ingredientsStatistics.summary.totalProducts}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Quantidade Total: </span>
                        <strong style={{ color: '#16a34a' }}>
                          {ingredientsStatistics.summary.totalQuantity.toLocaleString('pt-PT', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              ) : ingredientsStatistics && ingredientsStatistics.byDishType && ingredientsStatistics.byDishType.length === 0 ? (
                <div style={{ marginTop: '32px' }}>
                  <div style={canteenStatisticsStyles.noDataContainer}>
                    <p>Não há ingredientes utilizados para o período selecionado.</p>
                  </div>
                </div>
              ) : null}
            </>
          )}

        </div>
      </main>
    </div>
  );
}

