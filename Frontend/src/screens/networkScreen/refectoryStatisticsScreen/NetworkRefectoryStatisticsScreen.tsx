/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Bell, LogOut, ArrowLeft, Calendar, ChevronLeft, ChevronRight, TrendingUp, BarChart3, PieChart, LineChart } from 'lucide-react';
import { performanceStyles } from '../performanceScreen/PerformanceScreen.styles';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { performanceService, type WastePercentageResponse } from "../../../services/performanceService";
import { wasteReportService, type WasteReportStatistics } from "../../../services/wasteReportService";
import { mealService } from "../../../services/mealService";
import { LineChart as RechartsLineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

type FilterType = "day" | "week" | "dayOfWeek" | "month" | "year" | "all" | "dateRange";

const formatDateShort = (value: string) => {
  const date = new Date(value);
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
    const isMonday = dayOfWeek === 1;
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
          ...performanceStyles.calendarDay,
          ...(isCurrentMonth ? {} : performanceStyles.calendarDayOtherMonth),
          ...(isMonday && isSelected ? performanceStyles.calendarDaySelected : {}),
          ...(!isMonday ? { opacity: 0.3, cursor: 'not-allowed' } : { cursor: 'pointer' }),
        }}
      >
        {currentDate.getDate()}
      </div>
    );
  }

  return (
    <div style={performanceStyles.calendarContainer} data-week-calendar-container>
      <div style={performanceStyles.calendarHeader}>
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
          style={performanceStyles.calendarNavButton}
        >
          <ChevronLeft size={16} />
        </button>
        <span style={performanceStyles.calendarMonthYear}>
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
          style={performanceStyles.calendarNavButton}
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div style={performanceStyles.calendarGrid}>
        {["S", "T", "Q", "Q", "S", "S", "D"].map((day, idx) => (
          <div key={idx} style={performanceStyles.calendarDayHeader as React.CSSProperties}>
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
          ...performanceStyles.calendarDay,
          ...(isCurrentMonth ? {} : performanceStyles.calendarDayOtherMonth),
          ...(isSelected ? performanceStyles.calendarDaySelected : {}),
        }}
      >
        {currentDate.getDate()}
      </div>
    );
  }

  return (
    <div style={performanceStyles.calendarContainer} data-calendar-container>
      <div style={performanceStyles.calendarHeader}>
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
          style={performanceStyles.calendarNavButton}
        >
          <ChevronLeft size={16} />
        </button>
        <span style={performanceStyles.calendarMonthYear}>
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
          style={performanceStyles.calendarNavButton}
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div style={performanceStyles.calendarGrid}>
        {["S", "T", "Q", "Q", "S", "S", "D"].map((day, idx) => (
          <div key={idx} style={performanceStyles.calendarDayHeader as React.CSSProperties}>
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default function NetworkRefectoryStatisticsScreen() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Utilizador";

  // Filtro de refeitório (para NetworkManager pode escolher qualquer refeitório)
  const [selectedRefeitorioId, setSelectedRefeitorioId] = useState<string>("all");
  const [refeitorios, setRefeitorios] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedRefeitorioName, setSelectedRefeitorioName] = useState<string>("");

  const [filterType, setFilterType] = useState<FilterType>("day");
  const [dayFilter, setDayFilter] = useState<string>("");
  const [weekFilter, setWeekFilter] = useState<string>("");
  const [dayOfWeekFilter, setDayOfWeekFilter] = useState<number | null>(null);
  const [dayOfWeekStartDate, setDayOfWeekStartDate] = useState<string>("");
  const [dayOfWeekEndDate, setDayOfWeekEndDate] = useState<string>("");
  const [dateRangeStart, setDateRangeStart] = useState<string>("");
  const [dateRangeEnd, setDateRangeEnd] = useState<string>("");
  const [mealTypeFilter, setMealTypeFilter] = useState<string>("all");
  const [dishTypeFilter, setDishTypeFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [reservationWasteData, setReservationWasteData] = useState<WastePercentageResponse | null>(null);
  const [wasteReportData, setWasteReportData] = useState<WasteReportStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Calendários
  const [showDayCalendar, setShowDayCalendar] = useState(false);
  const [showWeekCalendar, setShowWeekCalendar] = useState(false);
  const [showDayOfWeekStartCalendar, setShowDayOfWeekStartCalendar] = useState(false);
  const [showDayOfWeekEndCalendar, setShowDayOfWeekEndCalendar] = useState(false);
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
  const [showDateRangeStartCalendar, setShowDateRangeStartCalendar] = useState(false);
  const [showDateRangeEndCalendar, setShowDateRangeEndCalendar] = useState(false);
  
  // Filtros locais para os cards
  const [notServidasMealFilter, setNotServidasMealFilter] = useState<string>("");
  const [notServidasDateFilter, setNotServidasDateFilter] = useState<string>("");
  const [servidasMealFilter, setServidasMealFilter] = useState<string>("");
  const [servidasDateFilter, setServidasDateFilter] = useState<string>("");

  // Buscar todos os refeitórios
  useEffect(() => {
    const fetchRefeitorios = async () => {
      try {
        const response = await axios.get<Array<{ id: number; name: string }>>(
          `${API_BASE_URL}/refeitorios`
        );
        setRefeitorios(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar refeitórios:", err);
      }
    };

    fetchRefeitorios();
  }, []);

  // Atualizar nome do refeitório selecionado
  useEffect(() => {
    if (selectedRefeitorioId && selectedRefeitorioId !== "all") {
      const refeitorio = refeitorios.find(r => r.id === Number(selectedRefeitorioId));
      setSelectedRefeitorioName(refeitorio?.name || "");
    } else {
      setSelectedRefeitorioName("");
    }
  }, [selectedRefeitorioId, refeitorios]);

  const loadData = useCallback(async () => {
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
      setReservationWasteData(null);
      setWasteReportData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Se nenhum refeitório estiver selecionado, não carregar dados
    if (!selectedRefeitorioId || selectedRefeitorioId === "all") {
      setReservationWasteData(null);
      setWasteReportData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const filters: any = {};
      
      if (filterType === "day" && dayFilter) {
        filters.date = dayFilter;
        filters.period = "day";
      } else if (filterType === "week" && weekFilter) {
        const monday = new Date(weekFilter);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        filters.dateRangeStart = weekFilter;
        filters.dateRangeEnd = sunday.toISOString().split('T')[0];
        filters.period = "week";
      } else if (filterType === "dayOfWeek" && dayOfWeekFilter !== null && dayOfWeekStartDate && dayOfWeekEndDate) {
        filters.dayOfWeek = dayOfWeekFilter;
        filters.dateRangeStart = dayOfWeekStartDate;
        filters.dateRangeEnd = dayOfWeekEndDate;
      } else if (filterType === "month" && monthFilter) {
        const monthDate = monthFilter + "-01";
        filters.date = monthDate;
        filters.period = "month";
      } else if (filterType === "year" && yearFilter) {
        filters.date = yearFilter + "-01-01";
        filters.period = "year";
      } else if (filterType === "dateRange" && dateRangeStart && dateRangeEnd) {
        filters.dateRangeStart = dateRangeStart;
        filters.dateRangeEnd = dateRangeEnd;
      } else if (filterType === "all") {
        // Não adicionar filtros de data
      }

      // Adicionar filtro de tipo de refeição
      if (mealTypeFilter !== "all") {
        filters.mealTypeId = Number(mealTypeFilter);
      }

      // Adicionar filtro de tipo de prato
      if (dishTypeFilter !== "all") {
        if (dishTypeFilter === "fish") {
          filters.dishTypeId = 2;
        } else if (dishTypeFilter === "meat") {
          filters.dishTypeId = 1;
        } else if (dishTypeFilter === "vegetarian") {
          filters.dishTypeId = 3;
        }
      }

      // Adicionar filtro por refeitório selecionado
      if (selectedRefeitorioId && selectedRefeitorioId !== "all") {
        filters.refeitorioId = Number(selectedRefeitorioId);
      }

      // Carregar desperdício de reservas não consumidas
      const reservationData = await performanceService.getWastePercentage(filters);
      setReservationWasteData(reservationData);

      // Carregar desperdício de pratos (waste reports)
      const reportFilters: any = { ...filters };
      if (mealTypeFilter !== "all") {
        reportFilters.mealTypeId = Number(mealTypeFilter);
      }
      if (dishTypeFilter !== "all") {
        if (dishTypeFilter === "fish") {
          reportFilters.dishTypeId = 2;
        } else if (dishTypeFilter === "meat") {
          reportFilters.dishTypeId = 1;
        } else if (dishTypeFilter === "vegetarian") {
          reportFilters.dishTypeId = 3;
        }
      }
      if (selectedRefeitorioId && selectedRefeitorioId !== "all") {
        reportFilters.refeitorioId = Number(selectedRefeitorioId);
      }
      const reportData = await wasteReportService.getWasteReportStatistics(reportFilters);
      setWasteReportData(reportData);
    } catch (err: any) {
      console.error("Error loading waste data:", err);
      setError(err.response?.data?.error || "Não foi possível carregar os dados de desperdício. Tente novamente.");
      setReservationWasteData(null);
      setWasteReportData(null);
    } finally {
      setLoading(false);
    }
  }, [filterType, dayFilter, weekFilter, dayOfWeekFilter, dayOfWeekStartDate, dayOfWeekEndDate, dateRangeStart, dateRangeEnd, mealTypeFilter, dishTypeFilter, monthFilter, yearFilter, selectedRefeitorioId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // useEffect para atualizar calendários quando as datas mudam
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

  const handleBack = () => {
    navigate("/network-dashboard");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  // Calcular totais filtrados
  const filteredReservationTotals = (() => {
    if (!reservationWasteData?.byMeal) {
      return {
        totalServed: reservationWasteData?.totalServed || 0,
        totalNotConsumed: reservationWasteData?.totalNotConsumed || 0,
        totalConsumed: (reservationWasteData?.totalServed || 0) - (reservationWasteData?.totalNotConsumed || 0),
        wastePercentage: reservationWasteData?.wastePercentage || 0,
      };
    }

    let filteredMeals = reservationWasteData.byMeal;
    if (mealTypeFilter !== "all") {
      filteredMeals = filteredMeals.filter(meal => meal.mealTypeId === Number(mealTypeFilter));
    }
    if (dishTypeFilter !== "all") {
      let targetDishTypeId: number;
      if (dishTypeFilter === "fish") {
        targetDishTypeId = 2;
      } else if (dishTypeFilter === "meat") {
        targetDishTypeId = 1;
      } else if (dishTypeFilter === "vegetarian") {
        targetDishTypeId = 3;
      } else {
        targetDishTypeId = 0;
      }
      filteredMeals = filteredMeals.filter(meal => {
        if (meal.dishTypeId === undefined || meal.dishTypeId === null) {
          return true;
        }
        return meal.dishTypeId === targetDishTypeId;
      });
    }

    const totalServed = filteredMeals.reduce((sum, meal) => sum + meal.served, 0);
    const totalNotConsumed = filteredMeals.reduce((sum, meal) => sum + meal.notConsumed, 0);
    const totalConsumed = filteredMeals.reduce((sum, meal) => sum + (meal.consumed || (meal.served - meal.notConsumed)), 0);
    const wastePercentage = totalServed > 0 ? (totalNotConsumed / totalServed) * 100 : 0;

    return {
      totalServed,
      totalNotConsumed,
      totalConsumed,
      wastePercentage,
    };
  })();

  const filteredWasteReportTotals = (() => {
    if (!wasteReportData?.byMeal) {
      return {
        totalReports: wasteReportData?.totalReports || 0,
        averageWaste: wasteReportData?.averageWaste || 0,
      };
    }

    let filteredMeals = wasteReportData.byMeal;
    if (mealTypeFilter !== "all") {
      filteredMeals = filteredMeals.filter(meal => meal.mealTypeId === Number(mealTypeFilter));
    }
    if (dishTypeFilter !== "all") {
      let targetDishTypeId: number;
      if (dishTypeFilter === "fish") {
        targetDishTypeId = 2;
      } else if (dishTypeFilter === "meat") {
        targetDishTypeId = 1;
      } else if (dishTypeFilter === "vegetarian") {
        targetDishTypeId = 3;
      } else {
        targetDishTypeId = 0;
      }
      filteredMeals = filteredMeals.filter(meal => {
        if (meal.dishTypeId === undefined || meal.dishTypeId === null) {
          return true;
        }
        return meal.dishTypeId === targetDishTypeId;
      });
    }

    const totalReports = filteredMeals.reduce((sum, meal) => sum + meal.totalReports, 0);
    const totalWaste = filteredMeals.reduce((sum, meal) => sum + (meal.averageWaste * meal.totalReports), 0);
    const averageWaste = totalReports > 0 ? totalWaste / totalReports : 0;

    return {
      totalReports,
      averageWaste,
    };
  })();

  // Preparar dados para gráficos
  const chartData = reservationWasteData?.byDate && reservationWasteData.byDate.length > 0 
    ? reservationWasteData.byDate.map(item => ({
        date: formatDateShort(item.date),
        servidas: item.served,
        nãoServidas: item.notConsumed,
        desperdício: Number(item.percentage.toFixed(2)),
        consumidas: item.served - item.notConsumed,
      }))
    : [];

  // Dados de evolução para desperdício não servidas
  const evolutionNotServidasData = reservationWasteData?.byDate && reservationWasteData.byDate.length > 0
    ? reservationWasteData.byDate.map(item => ({
        date: formatDateShort(item.date),
        desperdício: Number(item.percentage.toFixed(2)),
      }))
    : [];

  // Dados de evolução do desperdício total (combinando ambos os tipos)
  const evolutionTotalData = (() => {
    if (!reservationWasteData?.byDate || reservationWasteData.byDate.length === 0) {
      return [];
    }

    // Criar mapa de datas para desperdício servidas
    const servidasByDate: { [key: string]: { totalWaste: number; count: number } } = {};
    if (wasteReportData?.byMeal) {
      wasteReportData.byMeal.forEach(item => {
        const dateKey = formatDateShort(item.mealDate);
        if (!servidasByDate[dateKey]) {
          servidasByDate[dateKey] = { totalWaste: 0, count: 0 };
        }
        servidasByDate[dateKey].totalWaste += item.averageWaste;
        servidasByDate[dateKey].count += 1;
      });
    }

    // Combinar dados por data
    return reservationWasteData.byDate.map(item => {
      const dateKey = formatDateShort(item.date);
      const servidasData = servidasByDate[dateKey];
      const servidasAvg = servidasData ? servidasData.totalWaste / servidasData.count : 0;
      
      // Calcular desperdício total ponderado para esta data
      const reservationWeight = item.served;
      const plateWeight = servidasData ? servidasData.count : 0;
      const totalWeight = reservationWeight + plateWeight;
      
      let totalWasteForDate = 0;
      if (totalWeight > 0) {
        totalWasteForDate = ((item.percentage * reservationWeight) + (servidasAvg * plateWeight)) / totalWeight;
      } else if (reservationWeight > 0) {
        totalWasteForDate = item.percentage;
      } else if (plateWeight > 0) {
        totalWasteForDate = servidasAvg;
      }

      return {
        date: dateKey,
        desperdício: Number(totalWasteForDate.toFixed(2)),
      };
    });
  })();

  // Dados de evolução para desperdício servidas (agrupado por data)
  const evolutionServidasData = wasteReportData && wasteReportData.totalReports > 0
    ? (() => {
        // Se for filtro por dia, mostrar apenas o valor médio total
        if (filterType === "day" && dayFilter) {
          return [{
            date: formatDateShort(dayFilter),
            desperdício: Number(wasteReportData.averageWaste.toFixed(2)),
          }];
        }
        
        // Para outros períodos, agrupar por data
        if (wasteReportData.byMeal && wasteReportData.byMeal.length > 0) {
          // Agrupar por data
          const groupedByDate: { [key: string]: { totalWaste: number; count: number } } = {};
          
          wasteReportData.byMeal.forEach(item => {
            const dateKey = formatDateShort(item.mealDate);
            if (!groupedByDate[dateKey]) {
              groupedByDate[dateKey] = { totalWaste: 0, count: 0 };
            }
            groupedByDate[dateKey].totalWaste += item.averageWaste;
            groupedByDate[dateKey].count += 1;
          });
          
          // Converter para array e calcular média por data
          return Object.keys(groupedByDate)
            .sort((a, b) => {
              const dateA = new Date(a.split('/').reverse().join('-')).getTime();
              const dateB = new Date(b.split('/').reverse().join('-')).getTime();
              return dateA - dateB;
            })
            .map(date => ({
              date: date,
              desperdício: Number((groupedByDate[date].totalWaste / groupedByDate[date].count).toFixed(2)),
            }));
        }
        
        return [];
      })()
    : [];

  const pieData = reservationWasteData
    ? [
        { name: 'Consumidas', value: filteredReservationTotals.totalConsumed, color: '#16a34a' },
        { name: 'Não Servidas', value: filteredReservationTotals.totalNotConsumed, color: '#ef4444' },
      ]
    : [];

  const hasRequiredFilters = 
    (filterType === "day" && dayFilter) ||
    (filterType === "week" && weekFilter) ||
    (filterType === "dayOfWeek" && dayOfWeekFilter !== null && dayOfWeekStartDate && dayOfWeekEndDate) ||
    (filterType === "month" && monthFilter) ||
    (filterType === "year" && yearFilter) ||
    (filterType === "dateRange" && dateRangeStart && dateRangeEnd) ||
    (filterType === "all");

  const reservationWaste = filteredReservationTotals.wastePercentage;
  const plateWaste = filteredWasteReportTotals.averageWaste;
  
  let totalWaste = 0;
  let hasData = false;
  let calculationDetails = null;
  
  const hasReservationData = filteredReservationTotals.totalServed > 0 || filteredReservationTotals.totalNotConsumed > 0;
  const hasWasteReportData = filteredWasteReportTotals.totalReports > 0;
  
  if (hasReservationData && hasWasteReportData) {
    const reservationWeight = filteredReservationTotals.totalServed;
    const plateWeight = filteredWasteReportTotals.totalReports;
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
      };
    }
  } else if (hasReservationData) {
    totalWaste = reservationWaste;
    hasData = true;
  } else if (hasWasteReportData) {
    totalWaste = plateWaste;
    hasData = true;
  }

  const getPeriodLabel = () => {
    if (filterType === "day" && dayFilter) return formatDateShort(dayFilter);
    if (filterType === "week" && weekFilter) {
      const monday = new Date(weekFilter);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return `${formatDateShort(weekFilter)} - ${formatDateShort(sunday.toISOString().split('T')[0])}`;
    }
    if (filterType === "dayOfWeek" && dayOfWeekFilter !== null) {
      const dayNames = ["Domingos", "Segundas-feiras", "Terças-feiras", "Quartas-feiras", "Quintas-feiras", "Sextas-feiras", "Sábados"];
      let label = dayNames[dayOfWeekFilter];
      if (dayOfWeekStartDate && dayOfWeekEndDate) {
        label += ` (${formatDateShort(dayOfWeekStartDate)} - ${formatDateShort(dayOfWeekEndDate)})`;
      }
      return label;
    }
    if (filterType === "month" && monthFilter) return new Date(monthFilter + "-01").toLocaleDateString("pt-PT", { month: "long", year: "numeric" });
    if (filterType === "year" && yearFilter) return yearFilter;
    if (filterType === "dateRange" && dateRangeStart && dateRangeEnd) {
      return `${formatDateShort(dateRangeStart)} - ${formatDateShort(dateRangeEnd)}`;
    }
    if (filterType === "all") return "Sempre (Todos os dados)";
    return "Período Selecionado";
  };

  return (
    <div style={performanceStyles.pageContainer}>
      <header style={performanceStyles.header}>
        <div style={performanceStyles.headerLeft}>
          <button
            style={performanceStyles.backButton}
            onClick={handleBack}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <div style={performanceStyles.headerInfo}>
            <h1 style={performanceStyles.headerTitle}>BioCantinas</h1>
            <p style={performanceStyles.headerSubtitle}>
              Bem-vindo, {userName}
            </p>
          </div>
        </div>
        <div style={performanceStyles.headerActions}>
          <button 
            style={performanceStyles.iconButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell size={20} />
          </button>
          <button 
            style={performanceStyles.iconButton} 
            onClick={handleLogout}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <style>{`
        .waste-card-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .waste-card-scroll::-webkit-scrollbar-track {
          background: #f9fafb;
          border-radius: 10px;
        }
        .waste-card-scroll::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .waste-card-scroll::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
        .waste-meals-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .waste-meals-scroll::-webkit-scrollbar-track {
          background: #ffffff;
          border-radius: 10px;
        }
        .waste-meals-scroll::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .waste-meals-scroll::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
      <main style={performanceStyles.mainContent}>
        <div style={performanceStyles.contentWrapper}>
          <div style={performanceStyles.titleSection}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h2 style={performanceStyles.pageTitle}>
                <TrendingUp size={28} style={{ marginRight: '12px' }} />
                Estatísticas dos Refeitórios
              </h2>
              {selectedRefeitorioName && (
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#111827',
                  border: '1px solid #e5e7eb'
                }}>
                  {selectedRefeitorioName}
                </div>
              )}
            </div>
            <p style={performanceStyles.pageDescription}>
              Visualize os KPIs de desempenho dos refeitórios, incluindo desperdício e consumo. Selecione um refeitório para ver as estatísticas.
            </p>
          </div>

          {/* Filtros */}
          <div style={performanceStyles.filtersContainer}>
            {/* Filtro de Refeitório - PRIMEIRO */}
            <div style={performanceStyles.filterGroup}>
              <label style={performanceStyles.filterLabel} htmlFor="refeitorio-filter">Refeitório:</label>
              <select
                id="refeitorio-filter"
                value={selectedRefeitorioId}
                onChange={(e) => setSelectedRefeitorioId(e.target.value)}
                style={{
                  ...performanceStyles.select,
                  color: '#111827',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#16a34a';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="all">Escolher Refeitório</option>
                {refeitorios.map((refeitorio) => (
                  <option key={refeitorio.id} value={refeitorio.id}>
                    {refeitorio.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={performanceStyles.filterGroup}>
              <label style={performanceStyles.filterLabel} htmlFor="mealType-filter">Tipo de Refeição:</label>
              <select
                id="mealType-filter"
                value={mealTypeFilter}
                onChange={(e) => setMealTypeFilter(e.target.value)}
                style={{
                  ...performanceStyles.select,
                  color: '#111827',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#16a34a';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="all">Todas</option>
                <option value="1">Almoço</option>
                <option value="2">Jantar</option>
              </select>
            </div>

            <div style={performanceStyles.filterGroup}>
              <label style={performanceStyles.filterLabel} htmlFor="dishType-filter">Tipo de Prato:</label>
              <select
                id="dishType-filter"
                value={dishTypeFilter}
                onChange={(e) => setDishTypeFilter(e.target.value)}
                style={{
                  ...performanceStyles.select,
                  color: '#111827',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#16a34a';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="all">Todos</option>
                <option value="fish">Peixe</option>
                <option value="meat">Carne</option>
                <option value="vegetarian">Vegetariano</option>
              </select>
            </div>

            <div style={performanceStyles.filterGroup}>
              <label style={performanceStyles.filterLabel} htmlFor="period-filter">Período:</label>
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
                style={{
                  ...performanceStyles.select,
                  color: '#111827',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#16a34a';
                  e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
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
              <div style={performanceStyles.filterGroup}>
                <label style={performanceStyles.filterLabel} htmlFor="day-filter">Dia:</label>
                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-calendar-container>
                  <div 
                    style={performanceStyles.filterWrapper}
                    onClick={() => setShowDayCalendar(!showDayCalendar)}
                  >
                    <Calendar size={16} />
                    <span style={{
                      ...performanceStyles.dateButtonText,
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
                        style={performanceStyles.clearDateButton}
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
              <div style={performanceStyles.filterGroup}>
                <label style={performanceStyles.filterLabel} htmlFor="week-filter">Semana:</label>
                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-week-calendar-container>
                  <div 
                    style={performanceStyles.filterWrapper}
                    onClick={() => setShowWeekCalendar(!showWeekCalendar)}
                  >
                    <Calendar size={16} />
                    <span style={{
                      ...performanceStyles.dateButtonText,
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
                        style={performanceStyles.clearDateButton}
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
                <div style={performanceStyles.filterGroup}>
                  <label style={performanceStyles.filterLabel} htmlFor="dayOfWeek-filter">Dia da Semana:</label>
                  <select
                    id="dayOfWeek-filter"
                    value={dayOfWeekFilter !== null ? dayOfWeekFilter : ""}
                    onChange={(e) => setDayOfWeekFilter(e.target.value ? parseInt(e.target.value) : null)}
                    style={performanceStyles.select}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#16a34a';
                      e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
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
                <div style={performanceStyles.filterGroup}>
                  <label style={performanceStyles.filterLabel} htmlFor="dayOfWeek-start-date">Data Início:</label>
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-dayofweek-start-calendar-container>
                    <div 
                      style={performanceStyles.filterWrapper}
                      onClick={() => setShowDayOfWeekStartCalendar(!showDayOfWeekStartCalendar)}
                    >
                      <Calendar size={16} />
                      <span style={{
                        ...performanceStyles.dateButtonText,
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
                <div style={{...performanceStyles.filterGroup, marginLeft: '24px'}}>
                  <label style={performanceStyles.filterLabel} htmlFor="dayOfWeek-end-date">Data Fim:</label>
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-dayofweek-end-calendar-container>
                    <div 
                      style={performanceStyles.filterWrapper}
                      onClick={() => setShowDayOfWeekEndCalendar(!showDayOfWeekEndCalendar)}
                    >
                      <Calendar size={16} />
                      <span style={{
                        ...performanceStyles.dateButtonText,
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
              <div style={performanceStyles.filterGroup}>
                <label style={performanceStyles.filterLabel} htmlFor="month-filter">Mês:</label>
                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                  <select
                    id="month-filter"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    style={performanceStyles.select}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#16a34a';
                      e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
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
                        ...performanceStyles.clearDateButton,
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
              <div style={performanceStyles.filterGroup}>
                <label style={performanceStyles.filterLabel} htmlFor="year-filter">Ano:</label>
                <select
                  id="year-filter"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  style={performanceStyles.select}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#16a34a';
                    e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
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
                <div style={performanceStyles.filterGroup}>
                  <label style={performanceStyles.filterLabel} htmlFor="dateRange-start-date">Data Início:</label>
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-daterange-start-calendar-container>
                    <div 
                      style={performanceStyles.filterWrapper}
                      onClick={() => setShowDateRangeStartCalendar(!showDateRangeStartCalendar)}
                    >
                      <Calendar size={16} />
                      <span style={{
                        ...performanceStyles.dateButtonText,
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
                <div style={{...performanceStyles.filterGroup, marginLeft: '24px'}}>
                  <label style={performanceStyles.filterLabel} htmlFor="dateRange-end-date">Data Fim:</label>
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} data-daterange-end-calendar-container>
                    <div 
                      style={performanceStyles.filterWrapper}
                      onClick={() => setShowDateRangeEndCalendar(!showDateRangeEndCalendar)}
                    >
                      <Calendar size={16} />
                      <span style={{
                        ...performanceStyles.dateButtonText,
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
          </div>

          {/* Mensagem se nenhum refeitório estiver selecionado */}
          {selectedRefeitorioId === "all" && (
            <div style={performanceStyles.noDataContainer}>
              <p>Por favor, selecione um refeitório para ver as estatísticas.</p>
            </div>
          )}

          {/* Resultados */}
          {selectedRefeitorioId !== "all" && (
            <>
              {loading ? (
                <div style={performanceStyles.loadingContainer}>
                  <p>A carregar dados...</p>
                </div>
              ) : error ? (
                <div style={performanceStyles.errorContainer}>
                  <p>{error}</p>
                </div>
              ) : !hasRequiredFilters ? (
                <div style={performanceStyles.noDataContainer}>
                  <p>
                    {filterType === "day" && !dayFilter
                      ? "Por favor, selecione um dia para ver os dados."
                      : filterType === "week" && !weekFilter
                      ? "Por favor, selecione uma segunda-feira para ver os dados."
                      : filterType === "dayOfWeek" && (dayOfWeekFilter === null || !dayOfWeekStartDate || !dayOfWeekEndDate)
                      ? "Por favor, selecione um dia da semana e um intervalo de datas (Data Início e Data Fim) para ver os dados."
                      : filterType === "month" && !monthFilter
                      ? "Por favor, selecione um mês para ver os dados."
                      : filterType === "year" && !yearFilter
                      ? "Por favor, selecione um ano para ver os dados."
                      : filterType === "dateRange" && (!dateRangeStart || !dateRangeEnd)
                      ? "Por favor, selecione um intervalo de datas (Data Início e Data Fim) para ver os dados."
                      : "Por favor, selecione um período para ver os dados."}
                  </p>
                </div>
              ) : !hasData ? (
                <div style={performanceStyles.noDataContainer}>
                  <p>Não há dados de desperdício para o período selecionado.</p>
                </div>
              ) : (
                <>
                  {/* Card de Desperdício Total */}
                  <div style={performanceStyles.totalWasteCard}>
                    <div style={performanceStyles.totalWasteCardHeader}>
                      <h3 style={performanceStyles.totalWasteCardTitle}>Desperdício Total</h3>
                      <p style={performanceStyles.totalWasteCardSubtitle}>
                        {getPeriodLabel()}
                      </p>
                    </div>
                    <div style={performanceStyles.totalWastePercentage}>
                      <span style={performanceStyles.totalWastePercentageValue}>
                        {totalWaste.toFixed(2)}%
                      </span>
                      <p style={performanceStyles.totalWastePercentageDescription}>
                        {calculationDetails 
                          ? "Média ponderada do desperdício de refeições não servidas e refeições servidas"
                          : "Percentagem de desperdício de refeições não servidas"}
                      </p>
                    </div>
                    {calculationDetails && (
                      <div style={performanceStyles.calculationDetails}>
                        <p style={performanceStyles.calculationTitle}>Fórmula:</p>
                        <div style={performanceStyles.calculationFormula}>
                          <span>
                            ((% de Refeições Não Servidas × Total de Refeições Marcadas) + (% de Refeições Servidas × Total de Reports)) / (Total de Refeições Marcadas + Total de Reports)
                          </span>
                        </div>
                      </div>
                    )}
                    <div style={performanceStyles.totalWasteBreakdown}>
                      <div style={performanceStyles.totalWasteBreakdownItem}>
                        <span style={performanceStyles.totalWasteBreakdownLabel}>Refeições Não Servidas:</span>
                        <span style={performanceStyles.totalWasteBreakdownValue}>
                          {reservationWaste.toFixed(2)}%
                        </span>
                      </div>
                      <div style={performanceStyles.totalWasteBreakdownItem}>
                        <span style={performanceStyles.totalWasteBreakdownLabel}>Refeições Servidas:</span>
                        <span style={performanceStyles.totalWasteBreakdownValue}>
                          {plateWaste.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Gráfico de Evolução - Desperdício Global */}
                  {hasData && evolutionTotalData.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={performanceStyles.chartCard}>
                        <h3 style={performanceStyles.chartTitle}>
                          <LineChart size={20} />
                          Evolução do Desperdício Global
                        </h3>
                        <div style={performanceStyles.chartContainer}>
                          <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={evolutionTotalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorDesperdicioGlobal" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="date" 
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                              />
                              <YAxis 
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                                label={{ value: '% Desperdício', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#fff', 
                                  border: '1px solid #e5e7eb', 
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                formatter={(value: number) => `${value.toFixed(2)}%`}
                              />
                              <Legend />
                              <Area 
                                type="monotone" 
                                dataKey="desperdício" 
                                stroke="#16a34a" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorDesperdicioGlobal)"
                                name="% Desperdício Total"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card e Gráfico - Desperdício de Refeições Não Servidas */}
                  <div style={performanceStyles.cardChartRow}>
                    {/* Card */}
                    <div style={performanceStyles.wasteCard}>
                      <div style={performanceStyles.wasteCardHeader}>
                        <h3 style={performanceStyles.wasteCardTitle}>Desperdício de Refeições Não Servidas</h3>
                        <p style={performanceStyles.wasteCardSubtitle}>
                          Reservas marcadas mas não consumidas
                        </p>
                      </div>
                      {reservationWasteData ? (
                        <div style={performanceStyles.wasteCardContent}>
                          <div style={performanceStyles.wasteStat}>
                            <span style={performanceStyles.wasteStatLabel}>Refeições Marcadas:</span>
                            <span style={performanceStyles.wasteStatValue}>{filteredReservationTotals.totalServed}</span>
                          </div>
                          <div style={performanceStyles.wasteStat}>
                            <span style={performanceStyles.wasteStatLabel}>Servidas:</span>
                            <span style={performanceStyles.wasteStatValue}>
                              {filteredReservationTotals.totalConsumed}
                            </span>
                          </div>
                          <div style={performanceStyles.wasteStat}>
                            <span style={performanceStyles.wasteStatLabel}>Não Servidas:</span>
                            <span style={performanceStyles.wasteStatValue}>{filteredReservationTotals.totalNotConsumed}</span>
                          </div>
                           <div style={performanceStyles.wastePercentage}>
                             <span style={performanceStyles.wastePercentageLabel}>Desperdício (Refeições Não Servidas):</span>
                             <span style={performanceStyles.wastePercentageValue}>
                               {filteredReservationTotals.wastePercentage.toFixed(2)}%
                             </span>
                           </div>
                           {reservationWasteData.byMeal && reservationWasteData.byMeal.length > 0 && (
                            <>
                              {/* Filtros de pesquisa */}
                              <div style={{ marginTop: '16px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  <input
                                    type="text"
                                    placeholder="Pesquisar por refeição..."
                                    value={notServidasMealFilter}
                                    onChange={(e) => setNotServidasMealFilter(e.target.value)}
                                    style={{
                                      flex: 1,
                                      minWidth: '150px',
                                      padding: '8px 12px',
                                      border: '1px solid #e5e7eb',
                                      borderRadius: '8px',
                                      fontSize: '14px',
                                    }}
                                  />
                                  <input
                                    type="date"
                                    value={notServidasDateFilter}
                                    onChange={(e) => setNotServidasDateFilter(e.target.value)}
                                    style={{
                                      padding: '8px 12px',
                                      border: '1px solid #e5e7eb',
                                      borderRadius: '8px',
                                      fontSize: '14px',
                                    }}
                                  />
                                </div>
                              </div>
                            <div className="waste-meals-scroll" style={performanceStyles.wasteMealsList}>
                              <p style={performanceStyles.wasteMealsListTitle}>Refeições:</p>
                               {reservationWasteData.byMeal
                                 .filter((mealData) => {
                                   const mealMatch = !notServidasMealFilter || 
                                     mealData.mealName.toLowerCase().includes(notServidasMealFilter.toLowerCase()) ||
                                     (mealData.dishName && mealData.dishName.toLowerCase().includes(notServidasMealFilter.toLowerCase()));
                                   const dateMatch = !notServidasDateFilter || 
                                     mealData.mealDate.split('T')[0] === notServidasDateFilter;
                                   const mealTypeMatch = mealTypeFilter === "all" || 
                                     mealData.mealTypeId === Number(mealTypeFilter);
                                   let dishTypeMatch = true;
                                   if (dishTypeFilter !== "all") {
                                     let targetDishTypeId: number;
                                     if (dishTypeFilter === "fish") {
                                       targetDishTypeId = 2;
                                     } else if (dishTypeFilter === "meat") {
                                       targetDishTypeId = 1;
                                     } else if (dishTypeFilter === "vegetarian") {
                                       targetDishTypeId = 3;
                                     } else {
                                       targetDishTypeId = 0;
                                     }
                                     if (mealData.dishTypeId === undefined || mealData.dishTypeId === null) {
                                       dishTypeMatch = true;
                                     } else {
                                       dishTypeMatch = mealData.dishTypeId === targetDishTypeId;
                                     }
                                   }
                                   return mealMatch && dateMatch && mealTypeMatch && dishTypeMatch;
                                 })
                                 .map((mealData) => (
                                 <div key={mealData.mealId} style={performanceStyles.wasteMealItem}>
                                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                       <span style={performanceStyles.wasteMealName}>{mealData.mealName}</span>
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
                                       {formatDateShort(mealData.mealDate)}
                                     </span>
                                     <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                       Servidas: {mealData.consumed || (mealData.served - mealData.notConsumed)} | Não Servidas: {mealData.notConsumed}
                                     </span>
                                   </div>
                                   <span style={performanceStyles.wasteMealPercentage}>
                                     {mealData.percentage.toFixed(2)}%
                                   </span>
                                 </div>
                               ))}
                             </div>
                            </>
                           )}
                         </div>
                       ) : (
                         <div style={performanceStyles.noDataInCard}>
                           <p>Não há dados de desperdício de reservas para este período.</p>
                         </div>
                       )}
                     </div>

                    {/* Gráfico de Pizza - Desperdício Não Servidas */}
                    {reservationWasteData && filteredReservationTotals.totalServed > 0 && (() => {
                      const consumed = filteredReservationTotals.totalConsumed;
                      const notConsumed = filteredReservationTotals.totalNotConsumed;
                      const notServidasPieData = [
                        { name: 'Consumidas', value: consumed, color: '#16a34a' },
                        { name: 'Não Servidas', value: notConsumed, color: '#ef4444' }
                      ];
                      
                      return (
                        <div style={performanceStyles.chartCard}>
                          <h3 style={performanceStyles.chartTitle}>
                            <PieChart size={20} />
                            Desperdício de Refeições Não Servidas
                          </h3>
                          <div style={performanceStyles.chartContainer}>
                            <ResponsiveContainer width="100%" height={300}>
                            <RechartsPieChart>
                              <Pie
                                data={notServidasPieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {notServidasPieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#fff', 
                                  border: '1px solid #e5e7eb', 
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                formatter={(value: number) => value.toLocaleString('pt-PT')}
                              />
                              <Legend />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Gráfico de Evolução - Desperdício Não Servidas */}
                    {evolutionNotServidasData.length > 0 && (
                      <div style={performanceStyles.chartCard}>
                          <h3 style={performanceStyles.chartTitle}>
                            <LineChart size={20} />
                            Evolução do Desperdício (Não Servidas)
                          </h3>
                          <div style={performanceStyles.chartContainer}>
                            <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={evolutionNotServidasData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorDesperdicioNotServidas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#6b7280"
                              style={{ fontSize: '12px' }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis 
                              stroke="#6b7280"
                              style={{ fontSize: '12px' }}
                              label={{ value: '% Desperdício', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #e5e7eb', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                              }}
                              formatter={(value: number) => `${value.toFixed(2)}%`}
                            />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="desperdício" 
                              stroke="#ef4444" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorDesperdicioNotServidas)"
                              name="% Desperdício"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                          </div>
                      </div>
                    )}
                  </div>

                  {/* Card e Gráfico - Desperdício de Refeições Servidas */}
                  <div style={performanceStyles.cardChartRow}>
                    {/* Card */}
                    <div className="waste-card-scroll" style={performanceStyles.wasteCard}>
                      <div style={performanceStyles.wasteCardHeader}>
                        <h3 style={performanceStyles.wasteCardTitle}>Desperdício de Refeições Servidas</h3>
                        <p style={performanceStyles.wasteCardSubtitle}>
                          Comida deixada no prato após consumo, reportado pelo canteen staff
                        </p>
                      </div>
                      {wasteReportData ? (
                        <div style={performanceStyles.wasteCardContent}>
                          <div style={performanceStyles.wasteStat}>
                            <span style={performanceStyles.wasteStatLabel}>Total de Reports:</span>
                            <span style={performanceStyles.wasteStatValue}>{filteredWasteReportTotals.totalReports}</span>
                          </div>
                           {filteredWasteReportTotals.totalReports > 0 ? (
                             <>
                               <div style={performanceStyles.wastePercentage}>
                                 <span style={performanceStyles.wastePercentageLabel}>Desperdício (Refeições Servidas):</span>
                                 <span style={performanceStyles.wastePercentageValue}>
                                   {filteredWasteReportTotals.averageWaste.toFixed(2)}%
                                 </span>
                               </div>
                               {wasteReportData.byMeal && wasteReportData.byMeal.length > 0 && (
                            <>
                              {/* Filtros de pesquisa */}
                              <div style={{ marginTop: '16px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  <input
                                    type="text"
                                    placeholder="Pesquisar por refeição..."
                                    value={servidasMealFilter}
                                    onChange={(e) => setServidasMealFilter(e.target.value)}
                                    style={{
                                      flex: 1,
                                      minWidth: '150px',
                                      padding: '8px 12px',
                                      border: '1px solid #e5e7eb',
                                      borderRadius: '8px',
                                      fontSize: '14px',
                                    }}
                                  />
                                  <input
                                    type="date"
                                    value={servidasDateFilter}
                                    onChange={(e) => setServidasDateFilter(e.target.value)}
                                    style={{
                                      padding: '8px 12px',
                                      border: '1px solid #e5e7eb',
                                      borderRadius: '8px',
                                      fontSize: '14px',
                                    }}
                                  />
                                </div>
                              </div>
                            <div className="waste-meals-scroll" style={performanceStyles.wasteMealsList}>
                              <p style={performanceStyles.wasteMealsListTitle}>Refeições:</p>
                                     {wasteReportData.byMeal
                                     .filter((mealData) => {
                                       const mealMatch = !servidasMealFilter || 
                                         mealData.mealName.toLowerCase().includes(servidasMealFilter.toLowerCase()) ||
                                         (mealData.dishName && mealData.dishName.toLowerCase().includes(servidasMealFilter.toLowerCase()));
                                       const dateMatch = !servidasDateFilter || 
                                         mealData.mealDate.split('T')[0] === servidasDateFilter;
                                       const mealTypeMatch = mealTypeFilter === "all" || 
                                         mealData.mealTypeId === Number(mealTypeFilter);
                                       let dishTypeMatch = true;
                                       if (dishTypeFilter !== "all") {
                                         let targetDishTypeId: number;
                                         if (dishTypeFilter === "fish") {
                                           targetDishTypeId = 2;
                                         } else if (dishTypeFilter === "meat") {
                                           targetDishTypeId = 1;
                                         } else if (dishTypeFilter === "vegetarian") {
                                           targetDishTypeId = 3;
                                         } else {
                                           targetDishTypeId = 0;
                                         }
                                         if (mealData.dishTypeId === undefined || mealData.dishTypeId === null) {
                                           dishTypeMatch = true;
                                         } else {
                                           dishTypeMatch = mealData.dishTypeId === targetDishTypeId;
                                         }
                                       }
                                       return mealMatch && dateMatch && mealTypeMatch && dishTypeMatch;
                                     })
                                     .map((mealData) => (
                                     <div key={mealData.mealId} style={performanceStyles.wasteMealItem}>
                                       <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                           <span style={performanceStyles.wasteMealName}>{mealData.mealName}</span>
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
                                           {formatDateShort(mealData.mealDate)}
                                         </span>
                                         <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                           Reports: {mealData.totalReports}
                                         </span>
                                       </div>
                                       <span style={performanceStyles.wasteMealPercentage}>
                                         {mealData.averageWaste.toFixed(2)}%
                                       </span>
                                     </div>
                                   ))}
                                 </div>
                            </>
                               )}
                             </>
                           ) : (
                             <div style={performanceStyles.noDataInCard}>
                               <p>Não há reports de desperdício para este período.</p>
                             </div>
                           )}
                         </div>
                       ) : (
                         <div style={performanceStyles.noDataInCard}>
                           <p>Não há dados de desperdício de refeições servidas para este período.</p>
                         </div>
                       )}
                     </div>

                    {/* Gráfico de Pizza - Desperdício Servidas */}
                    {wasteReportData && filteredWasteReportTotals.totalReports > 0 && (() => {
                      const averageWaste = filteredWasteReportTotals.averageWaste;
                      const consumed = 100 - averageWaste;
                      const servidasPieData = [
                        { name: 'Consumidas', value: consumed, color: '#16a34a' },
                        { name: 'Desperdício', value: averageWaste, color: '#ef4444' }
                      ];
                      
                      return (
                        <div style={performanceStyles.chartCard}>
                          <h3 style={performanceStyles.chartTitle}>
                            <PieChart size={20} />
                            Desperdício de Refeições Servidas
                          </h3>
                          <div style={performanceStyles.chartContainer}>
                            <ResponsiveContainer width="100%" height={300}>
                            <RechartsPieChart>
                              <Pie
                                data={servidasPieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {servidasPieData.map((entry, index) => (
                                  <Cell key={`cell-servidas-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#fff', 
                                  border: '1px solid #e5e7eb', 
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                formatter={(value: number) => `${value.toFixed(1)}%`}
                              />
                              <Legend />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Gráfico de Evolução - Desperdício Servidas */}
                    {evolutionServidasData.length > 0 && (
                      <div style={performanceStyles.chartCard}>
                          <h3 style={performanceStyles.chartTitle}>
                            <LineChart size={20} />
                            Evolução do Desperdício (Servidas)
                          </h3>
                          <div style={performanceStyles.chartContainer}>
                            <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={evolutionServidasData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorDesperdicioServidas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#6b7280"
                              style={{ fontSize: '12px' }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis 
                              stroke="#6b7280"
                              style={{ fontSize: '12px' }}
                              label={{ value: '% Desperdício', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #e5e7eb', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                              }}
                              formatter={(value: number) => `${value.toFixed(2)}%`}
                            />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="desperdício" 
                              stroke="#ef4444" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorDesperdicioServidas)"
                              name="% Desperdício"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                          </div>
                      </div>
                    )}
                  </div>

                  {/* Gráfico de Barras - Comparação com Desperdício Total (Full Width) */}
                  {chartData.length > 0 && (
                    <div style={performanceStyles.comparisonChartContainer}>
                      <div style={performanceStyles.chartCard}>
                        <h3 style={performanceStyles.chartTitle}>
                          <BarChart3 size={20} />
                          Comparação: Servidas vs Não Servidas
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#6b7280"
                              style={{ fontSize: '12px' }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis 
                              stroke="#6b7280"
                              style={{ fontSize: '12px' }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #e5e7eb', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="servidas" fill="#16a34a" name="Servidas" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="nãoServidas" fill="#ef4444" name="Não Servidas" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

