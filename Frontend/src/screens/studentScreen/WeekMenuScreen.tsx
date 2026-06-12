import { useLogout } from "../../util/useLogout";
import { ArrowLeft, Bell, Calendar, Filter, LogOut, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { weekMenuStyles } from "./WeekMenuScreen.styles";
import { useEffect, useMemo, useState, useCallback } from "react";
import { menuService } from "../../services/menuService";
import type { WeekMenu } from "../../services/menuService";
import { reservationService, type ReservationWithRelations } from "../../services/reservationService";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

type FilterOption = "all" | "carne" | "peixe" | "vegetariano";

const isMobile = () => window.innerWidth < 768;

const formatDate = (value?: string | Date) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" });
};

const formatDateFull = (value?: string | Date) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const getDayOfWeekName = (value?: string | Date): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  return dayNames[date.getDay()];
};

const getWeekRange = (weekOffset: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Encontrar a segunda-feira da semana atual
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Segunda-feira
  const mondayOfCurrentWeek = new Date(today);
  mondayOfCurrentWeek.setDate(today.getDate() + diff);
  
  // Aplicar offset de semanas
  const targetMonday = new Date(mondayOfCurrentWeek);
  targetMonday.setDate(mondayOfCurrentWeek.getDate() + (weekOffset * 7));
  
  const targetSunday = new Date(targetMonday);
  targetSunday.setDate(targetMonday.getDate() + 6);
  
  return {
    start: targetMonday,
    end: targetSunday
  };
};

const normalizeType = (type?: string) => (type || "").trim().toLowerCase();

const mapTypeToCategory = (raw?: string | null): FilterOption | "outro" => {
  const t = normalizeType(raw || undefined);
  if (!t) return "outro";
  if (t.includes("carne") || t.includes("meat")) return "carne";
  if (t.includes("peixe") || t.includes("fish")) return "peixe";
  if (t.includes("veg")) return "vegetariano";
  return "outro";
};

export default function WeekMenuScreen() {
  const navigate = useNavigate();
  const { user } = useSelector((s: any) => s.auth);
  const isNursingHome = (user?.role || "").toLowerCase() === "nursinghome";
  const menuTypeId = isNursingHome ? 2 : 1; // 1 para School, 2 para Nursing Home
  const [menu, setMenu] = useState<WeekMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [weekOffset, setWeekOffset] = useState(0); // 0 = semana atual, -1 = anterior, 1 = próxima
  const [reservations, setReservations] = useState<Record<number, { id: number; status: string }>>(
    {}
  );
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [popupMealId, setPopupMealId] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number | string>>({});
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; quantity: number; onConfirm: () => void }>({
    show: false,
    quantity: 0,
    onConfirm: () => {},
  });
  const [canteenName, setCanteenName] = useState<string | null>(null);

  const getQuantity = (mealId: number): number | string => {
    const q = quantities[mealId];
    if (q === undefined || q === null) return 1;
    if (q === "" || (typeof q === "string" && q.trim() === "")) return "";
    const numQ = typeof q === "number" ? q : Number(q);
    if (Number.isNaN(numQ)) return 1;
    return Math.max(1, Math.floor(numQ));
  };

  const refreshReservations = async (userId?: number) => {
    if (!userId) return;
    try {
      const data = await reservationService.listReservations({ userId, status: "active" });
      const map: Record<number, { id: number; status: string }> = {};
      data.forEach((r: ReservationWithRelations) => {
        map[r.mealId] = { id: r.id, status: r.status };
      });
      setReservations(map);
    } catch (err) {
      // ignore
    }
  };

  const handleLogout = useLogout();

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await menuService.getCurrentWeekMenu(menuTypeId, weekOffset);
      setMenu(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setMenu(null);
        setError(null); // Não é erro, apenas não há menu
      } else {
        setError("Não foi possível carregar o menu semanal. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }, [menuTypeId, weekOffset]);

  useEffect(() => {
    loadMenu();
    refreshReservations(user?.id);
  }, [loadMenu, user?.id]);

  // Buscar nome da cantina
  useEffect(() => {
    const fetchCanteenName = async () => {
      // Se o user já tem canteen.name, usar diretamente
      if (user?.canteen?.name) {
        setCanteenName(user.canteen.name);
        return;
      }
      
      // Se tem canteenId mas não tem canteen.name, buscar
      if (user?.canteenId) {
        try {
          const response = await axios.get(`${API_BASE_URL}/canteens/${user.canteenId}`);
          if (response.data?.name) {
            setCanteenName(response.data.name);
          }
        } catch (err) {
          console.error("Erro ao buscar nome da cantina:", err);
          setCanteenName(null);
        }
      } else {
        setCanteenName(null);
      }
    };

    if (user) {
      fetchCanteenName();
    }
  }, [user?.canteenId, user?.canteen?.name, user]);

  const filteredDays = useMemo(() => {
    if (!menu) return { weekdays: [], weekend: [] };
    
    const processDays = (days: typeof menu.days) => {
      if (filter === "all") {
        return days.map((day) => ({
          ...day,
          meals: day.meals.map((meal) => ({
            ...meal,
            type: mapTypeToCategory(meal.type),
            date: day.date,
          })),
        }));
      }
      return days.map((day) => {
        const meals = day.meals
          .map((meal) => ({ ...meal, type: mapTypeToCategory(meal.type), date: day.date }))
          .filter((meal) => meal.type === filter);
        return { ...day, meals };
      });
    };

    const processedDays = processDays(menu.days);
    
    // Separar dias da semana (segunda a sexta) e fim de semana (sábado e domingo)
    const weekdays: typeof processedDays = [];
    const weekend: typeof processedDays = [];
    
    processedDays.forEach((day) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Domingo (0) ou Sábado (6)
        weekend.push(day);
      } else {
        // Segunda (1) a Sexta (5)
        weekdays.push(day);
      }
    });
    
    // Ordenar: weekdays por ordem (segunda a sexta), weekend por ordem (sábado, domingo)
    weekdays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    weekend.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return { weekdays, weekend };
  }, [filter, menu]);

  // Função auxiliar para separar refeições por mealTypeId
  const separateMealsByType = (meals: any[]) => {
    const lunch = meals.filter((meal) => meal.mealTypeId === 1);
    const dinner = meals.filter((meal) => meal.mealTypeId === 2);
    return { lunch, dinner };
  };

  return (
    <div style={weekMenuStyles.pageContainer}>
      <header style={weekMenuStyles.header}>
        <div style={weekMenuStyles.headerLeft}>
          <button
            style={weekMenuStyles.backButton}
            onClick={() => navigate(isNursingHome ? "/nursinghome-dashboard" : "/student-dashboard")}
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <div style={weekMenuStyles.headerText}>
            <h1 style={weekMenuStyles.headerTitle}>Menu semanal</h1>
            <p style={weekMenuStyles.headerSubtitle}>
              Consulte as refeições disponíveis por dia.
            </p>
          </div>
        </div>
        <div style={weekMenuStyles.headerActions}>
          <button style={weekMenuStyles.iconButton} aria-label="Notificações">
            <Bell size={20} />
          </button>
          <button
            style={weekMenuStyles.iconButton}
            aria-label="Sair"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main style={weekMenuStyles.mainContent}>
        {/* Indicador de Semana com Navegação */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '16px 24px',
          marginBottom: '16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setWeekOffset(prev => prev - 1)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              color: '#111827',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Semana anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <Calendar size={20} color="#16a34a" />
          <span style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827'
          }}>
            {(() => {
              // Sempre mostrar a semana calculada baseada no weekOffset
              const weekRange = getWeekRange(weekOffset);
              return `Semana de ${formatDateFull(weekRange.start)} a ${formatDateFull(weekRange.end)}`;
            })()}
          </span>
          {canteenName && (
            <div style={{
              marginLeft: '16px',
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
          <button
            onClick={() => setWeekOffset(prev => prev + 1)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              color: '#111827',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Próxima semana"
          >
            <ChevronRight size={20} />
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              style={{
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                marginLeft: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#15803d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#16a34a';
              }}
            >
              Ir para a semana atual
            </button>
          )}
        </div>

        <div style={weekMenuStyles.toolbar}>
          <div style={weekMenuStyles.actions}>
            <div style={weekMenuStyles.filterWrapper}>
              <Filter size={16} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterOption)}
                style={weekMenuStyles.select}
              >
                <option value="all">Todas</option>
                <option value="carne">Carne</option>
                <option value="peixe">Peixe</option>
                <option value="vegetariano">Vegetariano</option>
              </select>
            </div>
            {/* debug toggle removed */}
          </div>
        </div>

        {error && <div style={weekMenuStyles.errorBox}>{error}</div>}

        {loading ? (
          <div style={weekMenuStyles.placeholderBox}>A carregar menu semanal...</div>
        ) : !menu || (filteredDays.weekdays.length === 0 && filteredDays.weekend.length === 0) ? (
          <div style={weekMenuStyles.placeholderBox}>
            Ainda sem menu para esta semana.
          </div>
        ) : (
          <>
            {/* Dias da semana (Segunda a Sexta) */}
            <div style={weekMenuStyles.daysGrid}>
              {filteredDays.weekdays.map((day) => {
                const { lunch, dinner } = separateMealsByType(day.meals);
                return (
                <div key={day.date} style={weekMenuStyles.dayCard}>
                <div style={weekMenuStyles.dayHeader}>
                  <h3 style={weekMenuStyles.dayTitle}>
                    {getDayOfWeekName(day.date)}
                  </h3>
                  <span style={{ fontSize: "9px", fontWeight: 500, color: "#6b7280", marginTop: "1px" }}>
                    {formatDate(day.date)}
                  </span>
                </div>

                {lunch.length === 0 && dinner.length === 0 ? (
                  <div style={weekMenuStyles.mealEmpty}>Nenhuma refeição deste tipo.</div>
                ) : (
                  <>
                    {/* Seção de Almoço */}
                    {lunch.length > 0 && (
                      <>
                        <div style={{ 
                          fontSize: "10px", 
                          fontWeight: 700, 
                          color: "#374151", 
                          marginTop: "8px",
                          marginBottom: "6px",
                          paddingBottom: "4px",
                          borderBottom: "1px solid #e5e7eb"
                        }}>
                          ALMOÇO
                        </div>
                        <ul style={weekMenuStyles.mealList}>
                          {lunch.map((meal) => (
                            <li key={meal.id} style={weekMenuStyles.mealItem}>
                              <div style={weekMenuStyles.mealHeader}>
                                <span style={weekMenuStyles.mealName}>{meal.name}</span>
                                <span style={weekMenuStyles.mealTag}>
                                  {meal.type || "Refeição"}
                                </span>
                              </div>
                              <p style={weekMenuStyles.mealDescription}>
                                {meal.dishName || "Prato não especificado"}
                              </p>
                              <div style={weekMenuStyles.mealActions}>
                          {reservations[meal.id]?.status === "active" ? (
                            <button
                              style={{ ...weekMenuStyles.reserveButton, backgroundColor: "#dc2626" }}
                              disabled={actionLoading === meal.id}
                              onClick={async () => {
                                const res = reservations[meal.id];
                                if (!res) return;
                                try {
                                  setActionLoading(meal.id);
                                  await reservationService.cancelReservation(res.id);
                                  const map = { ...reservations };
                                  delete map[meal.id];
                                  setReservations(map);
                                } catch (err) {
                                  alert("Não foi possível desmarcar. Tente novamente.");
                                } finally {
                                  setActionLoading(null);
                                }
                              }}
                            >
                              {actionLoading === meal.id ? "A desmarcar..." : "Desmarcar"}
                            </button>
                          ) : (
                            <button
                              style={weekMenuStyles.reserveButton}
                              disabled={actionLoading === meal.id}
                              onClick={() => {
                                const qty = isNursingHome ? getQuantity(meal.id) : 1;
                                const finalQty = typeof qty === "string" || qty < 1 ? 1 : qty;
                                
                                // Aviso de confirmação para 100 ou mais senhas
                                if (finalQty >= 100) {
                                  setConfirmDialog({
                                    show: true,
                                    quantity: finalQty,
                                    onConfirm: () => {
                                      setConfirmDialog({ show: false, quantity: 0, onConfirm: () => {} });
                                      navigate("/reservation", {
                                        state: {
                                          mealId: meal.id,
                                          name: meal.name,
                                          dishName: meal.dishName,
                                          type: meal.type,
                                          date: meal.date || day.date,
                                          quantity: finalQty,
                                        },
                                      });
                                    },
                                  });
                                  return;
                                }
                                
                                navigate("/reservation", {
                                  state: {
                                    mealId: meal.id,
                                    name: meal.name,
                                    dishName: meal.dishName,
                                    type: meal.type,
                                    date: meal.date || day.date,
                                    quantity: finalQty,
                                  },
                                });
                              }}
                            >
                              Reservar
                            </button>
                          )}
                          
                          {isNursingHome && !reservations[meal.id]?.status && (
                            <div style={weekMenuStyles.quantityWrapper}>
                              <span style={weekMenuStyles.quantityLabel}>Senhas</span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={getQuantity(meal.id)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      // Permitir campo vazio temporariamente
                                      if (inputValue === "") {
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [meal.id]: "" as any,
                                        }));
                                        return;
                                      }
                                      const val = Number(inputValue);
                                      if (!Number.isNaN(val)) {
                                        const clampedValue = Math.max(1, val);
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [meal.id]: clampedValue,
                                        }));
                                      }
                                    }}
                                onBlur={(e) => {
                                  // Se o campo ficar vazio ou for inválido ao perder foco, definir como 1
                                  const value = Number(e.target.value);
                                  if (e.target.value === "" || Number.isNaN(value) || value < 1) {
                                    setQuantities((prev) => ({
                                      ...prev,
                                      [meal.id]: 1,
                                    }));
                                  }
                                }}
                                style={weekMenuStyles.quantityInput}
                              />
                            </div>
                          )}
                          
                          <button
                            onClick={() => setPopupMealId(p => p === meal.id ? null : meal.id)}
                            aria-label={popupMealId === meal.id ? "Fechar informação" : "Mostrar informação"}
                            title={popupMealId === meal.id ? "Fechar informação" : "Mostrar informação"}
                            style={weekMenuStyles.infoButton}
                          >
                            i
                          </button>

                          {popupMealId === meal.id && (
                            <div style={{
                              position: 'absolute',
                              top: 'calc(100% + 10px)',
                              right: 0,
                              width: 320,
                              zIndex: 40,
                              padding: 12,
                              background: '#ffffff',
                              borderRadius: 8,
                              boxShadow: '0 6px 18px rgba(15, 23, 42, 0.12)'
                            }}>
                              <div style={{ marginBottom: 8 }}>
                                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>Alergénios</h4>
                                <div style={{ height: 6 }} />
                                {meal.allergens && meal.allergens.length > 0 ? (
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {meal.allergens.map((a) => (
                                      <span key={String(a)} style={{ background: '#1f2937', color: '#fff', padding: '6px 10px', borderRadius: 999, fontSize: 13 }}>{typeof a === 'number' || (!isNaN(Number(a)) && String(a).trim() !== '') ? `Allergen #${a}` : a}</span>
                                    ))}
                                  </div>
                                ) : (
                                  <div style={{ color: '#6b7280' }}>Nenhum alergénio declarado.</div>
                                )}
                              </div>

                              <div>
                                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>Nutrição</h4>
                                <div style={{ height: 6 }} />
                                {meal.nutrition && meal.nutrition.length > 0 ? (
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {meal.nutrition.map((n) => (
                                      <span key={n.typeId} style={{ background: '#111827', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 13 }}>
                                        {(() => {
                                          // Prefer backend-provided numeric value and unit. Fallbacks: use grams if missing.
                                          const val = typeof (n as any).value === 'number' ? (n as any).value : (typeof (n as any).grams === 'number' ? (n as any).grams : null);
                                          const unit = (n as any).unit || 'g';
                                          const displayVal = val === null || val === undefined ? '—' : (Math.round(val * 100) / 100).toString();
                                          return n.name ? `${n.name}: ${displayVal}${unit ? ' ' + unit : ''}` : `Type ${n.typeId}: ${displayVal}${unit ? ' ' + unit : ''}`;
                                        })()}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <div style={{ color: '#6b7280' }}>Sem informação nutricional.</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                      </>
                    )}
                    
                    {/* Seção de Jantar */}
                    {dinner.length > 0 && (
                      <>
                        <div style={{ 
                          fontSize: "10px", 
                          fontWeight: 700, 
                          color: "#374151", 
                          marginTop: lunch.length > 0 ? "12px" : "8px",
                          marginBottom: "6px",
                          paddingTop: lunch.length > 0 ? "8px" : "0px",
                          paddingBottom: "4px",
                          borderTop: lunch.length > 0 ? "1px solid #e5e7eb" : "none",
                          borderBottom: "1px solid #e5e7eb"
                        }}>
                          JANTAR
                        </div>
                        <ul style={weekMenuStyles.mealList}>
                          {dinner.map((meal) => (
                            <li key={meal.id} style={weekMenuStyles.mealItem}>
                              <div style={weekMenuStyles.mealHeader}>
                                <span style={weekMenuStyles.mealName}>{meal.name}</span>
                                <span style={weekMenuStyles.mealTag}>
                                  {meal.type || "Refeição"}
                                </span>
                              </div>
                              <p style={weekMenuStyles.mealDescription}>
                                {meal.dishName || "Prato não especificado"}
                              </p>
                              <div style={weekMenuStyles.mealActions}>
                          {reservations[meal.id]?.status === "active" ? (
                            <button
                              style={{ ...weekMenuStyles.reserveButton, backgroundColor: "#dc2626" }}
                              disabled={actionLoading === meal.id}
                              onClick={async () => {
                                const res = reservations[meal.id];
                                if (!res) return;
                                try {
                                  setActionLoading(meal.id);
                                  await reservationService.cancelReservation(res.id);
                                  const map = { ...reservations };
                                  delete map[meal.id];
                                  setReservations(map);
                                } catch (err) {
                                  alert("Não foi possível desmarcar. Tente novamente.");
                                } finally {
                                  setActionLoading(null);
                                }
                              }}
                            >
                              {actionLoading === meal.id ? "A desmarcar..." : "Desmarcar"}
                            </button>
                          ) : (
                            <button
                              style={weekMenuStyles.reserveButton}
                              disabled={actionLoading === meal.id}
                              onClick={() => {
                                const qty = isNursingHome ? getQuantity(meal.id) : 1;
                                const finalQty = typeof qty === "string" || qty < 1 ? 1 : qty;
                                
                                // Aviso de confirmação para 100 ou mais senhas
                                if (finalQty >= 100) {
                                  setConfirmDialog({
                                    show: true,
                                    quantity: finalQty,
                                    onConfirm: () => {
                                      setConfirmDialog({ show: false, quantity: 0, onConfirm: () => {} });
                                      navigate("/reservation", {
                                        state: {
                                          mealId: meal.id,
                                          name: meal.name,
                                          dishName: meal.dishName,
                                          type: meal.type,
                                          date: meal.date || day.date,
                                          quantity: finalQty,
                                        },
                                      });
                                    },
                                  });
                                  return;
                                }
                                
                                navigate("/reservation", {
                                  state: {
                                    mealId: meal.id,
                                    name: meal.name,
                                    dishName: meal.dishName,
                                    type: meal.type,
                                    date: meal.date || day.date,
                                    quantity: finalQty,
                                  },
                                });
                              }}
                            >
                              Reservar
                            </button>
                          )}
                          
                          {isNursingHome && !reservations[meal.id]?.status && (
                            <div style={weekMenuStyles.quantityWrapper}>
                              <span style={weekMenuStyles.quantityLabel}>Senhas</span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={getQuantity(meal.id)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      // Permitir campo vazio temporariamente
                                      if (inputValue === "") {
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [meal.id]: "" as any,
                                        }));
                                        return;
                                      }
                                      const val = Number(inputValue);
                                      if (!Number.isNaN(val)) {
                                        const clampedValue = Math.max(1, val);
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [meal.id]: clampedValue,
                                        }));
                                      }
                                    }}
                                onBlur={(e) => {
                                  // Se o campo ficar vazio ou for inválido ao perder foco, definir como 1
                                  const value = Number(e.target.value);
                                  if (e.target.value === "" || Number.isNaN(value) || value < 1) {
                                    setQuantities((prev) => ({
                                      ...prev,
                                      [meal.id]: 1,
                                    }));
                                  }
                                }}
                                style={weekMenuStyles.quantityInput}
                              />
                            </div>
                          )}
                          
                          <button
                            onClick={() => setPopupMealId(p => p === meal.id ? null : meal.id)}
                            aria-label={popupMealId === meal.id ? "Fechar informação" : "Mostrar informação"}
                            title={popupMealId === meal.id ? "Fechar informação" : "Mostrar informação"}
                            style={weekMenuStyles.infoButton}
                          >
                            i
                          </button>

                          {popupMealId === meal.id && (
                            <div style={{
                              position: 'absolute',
                              top: 'calc(100% + 10px)',
                              right: 0,
                              width: 320,
                              zIndex: 40,
                              padding: 12,
                              background: '#ffffff',
                              borderRadius: 8,
                              boxShadow: '0 6px 18px rgba(15, 23, 42, 0.12)'
                            }}>
                              <div style={{ marginBottom: 8 }}>
                                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>Alergénios</h4>
                                <div style={{ height: 6 }} />
                                {meal.allergens && meal.allergens.length > 0 ? (
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {meal.allergens.map((a) => (
                                      <span key={String(a)} style={{ background: '#1f2937', color: '#fff', padding: '6px 10px', borderRadius: 999, fontSize: 13 }}>{typeof a === 'number' || (!isNaN(Number(a)) && String(a).trim() !== '') ? `Allergen #${a}` : a}</span>
                                    ))}
                                  </div>
                                ) : (
                                  <div style={{ color: '#6b7280' }}>Nenhum alergénio declarado.</div>
                                )}
                              </div>

                              <div>
                                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>Nutrição</h4>
                                <div style={{ height: 6 }} />
                                {meal.nutrition && meal.nutrition.length > 0 ? (
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {meal.nutrition.map((n) => (
                                      <span key={n.typeId} style={{ background: '#111827', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 13 }}>
                                        {(() => {
                                          // Prefer backend-provided numeric value and unit. Fallbacks: use grams if missing.
                                          const val = typeof (n as any).value === 'number' ? (n as any).value : (typeof (n as any).grams === 'number' ? (n as any).grams : null);
                                          const unit = (n as any).unit || 'g';
                                          const displayVal = val === null || val === undefined ? '—' : (Math.round(val * 100) / 100).toString();
                                          return n.name ? `${n.name}: ${displayVal}${unit ? ' ' + unit : ''}` : `Type ${n.typeId}: ${displayVal}${unit ? ' ' + unit : ''}`;
                                        })()}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <div style={{ color: '#6b7280' }}>Sem informação nutricional.</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </div>
                );
              })}
            </div>
            
            {/* Fim de semana (Sábado e Domingo) - Centrados em baixo */}
            {filteredDays.weekend.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile() ? "1fr" : "repeat(2, minmax(140px, 1fr))",
                gap: "10px",
                alignItems: "start",
                width: "100%",
                maxWidth: isMobile() ? "100%" : "40%",
                margin: "20px auto 0 auto",
                boxSizing: "border-box" as const,
              }}>
                {filteredDays.weekend.map((day) => {
                  const { lunch, dinner } = separateMealsByType(day.meals);
                  return (
                  <div key={day.date} style={weekMenuStyles.dayCard}>
                    <div style={weekMenuStyles.dayHeader}>
                      <h3 style={weekMenuStyles.dayTitle}>
                        {getDayOfWeekName(day.date)}
                      </h3>
                      <span style={{ fontSize: "9px", fontWeight: 500, color: "#6b7280", marginTop: "1px" }}>
                        {formatDate(day.date)}
                      </span>
                    </div>

                    {lunch.length === 0 && dinner.length === 0 ? (
                      <div style={weekMenuStyles.mealEmpty}>Nenhuma refeição deste tipo.</div>
                    ) : (
                      <>
                        {/* Seção de Almoço */}
                        {lunch.length > 0 && (
                          <>
                            <div style={{ 
                              fontSize: "10px", 
                              fontWeight: 700, 
                              color: "#374151", 
                              marginTop: "8px",
                              marginBottom: "6px",
                              paddingBottom: "4px",
                              borderBottom: "1px solid #e5e7eb"
                            }}>
                              ALMOÇO
                            </div>
                      <ul style={weekMenuStyles.mealList}>
                              {lunch.map((meal) => (
                          <li key={meal.id} style={weekMenuStyles.mealItem}>
                            <div style={weekMenuStyles.mealHeader}>
                              <span style={weekMenuStyles.mealName}>{meal.name}</span>
                              <span style={weekMenuStyles.mealTag}>
                                {meal.type || "Refeição"}
                              </span>
                            </div>
                            <p style={weekMenuStyles.mealDescription}>
                              {meal.dishName || "Prato não especificado"}
                            </p>
                            <div style={weekMenuStyles.mealActions}>
                              {reservations[meal.id]?.status === "active" ? (
                                <button
                                  style={{ ...weekMenuStyles.reserveButton, backgroundColor: "#dc2626" }}
                                  disabled={actionLoading === meal.id}
                                  onClick={async () => {
                                    const res = reservations[meal.id];
                                    if (!res) return;
                                    try {
                                      setActionLoading(meal.id);
                                      await reservationService.cancelReservation(res.id);
                                      const map = { ...reservations };
                                      delete map[meal.id];
                                      setReservations(map);
                                    } catch (err) {
                                      alert("Não foi possível desmarcar. Tente novamente.");
                                    } finally {
                                      setActionLoading(null);
                                    }
                                  }}
                                >
                                  {actionLoading === meal.id ? "A desmarcar..." : "Desmarcar"}
                                </button>
                              ) : (
                                <button
                                  style={weekMenuStyles.reserveButton}
                                  disabled={actionLoading === meal.id}
                                  onClick={() => {
                                    const qty = isNursingHome ? getQuantity(meal.id) : 1;
                                    const finalQty = typeof qty === "string" || qty < 1 ? 1 : qty;
                                    
                                    // Aviso de confirmação para 100 ou mais senhas
                                    if (finalQty >= 100) {
                                      setConfirmDialog({
                                        show: true,
                                        quantity: finalQty,
                                        onConfirm: () => {
                                          setConfirmDialog({ show: false, quantity: 0, onConfirm: () => {} });
                                          navigate("/reservation", {
                                            state: {
                                              mealId: meal.id,
                                              name: meal.name,
                                              dishName: meal.dishName,
                                              type: meal.type,
                                              date: meal.date || day.date,
                                              quantity: finalQty,
                                            },
                                          });
                                        },
                                      });
                                      return;
                                    }
                                    
                                    navigate("/reservation", {
                                      state: {
                                        mealId: meal.id,
                                        name: meal.name,
                                        dishName: meal.dishName,
                                        type: meal.type,
                                        date: meal.date || day.date,
                                        quantity: finalQty,
                                      },
                                    });
                                  }}
                                >
                                  Reservar
                                </button>
                              )}
                              
                              {isNursingHome && !reservations[meal.id]?.status && (
                                <div style={weekMenuStyles.quantityWrapper}>
                                  <span style={weekMenuStyles.quantityLabel}>Senhas</span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={getQuantity(meal.id)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (inputValue === "") {
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [meal.id]: "" as any,
                                        }));
                                        return;
                                      }
                                      const val = Number(inputValue);
                                      if (!Number.isNaN(val)) {
                                        const clampedValue = Math.max(1, val);
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [meal.id]: clampedValue,
                                        }));
                                      }
                                    }}
                                    style={weekMenuStyles.quantityInput}
                                  />
                                </div>
                              )}
                              
                              <button
                                onClick={() => setPopupMealId(p => p === meal.id ? null : meal.id)}
                                aria-label={popupMealId === meal.id ? "Fechar informação" : "Mostrar informação"}
                                title={popupMealId === meal.id ? "Fechar informação" : "Mostrar informação"}
                                style={weekMenuStyles.infoButton}
                              >
                                i
                              </button>

                              {popupMealId === meal.id && (
                                <div style={{
                                  position: 'absolute',
                                  top: 'calc(100% + 10px)',
                                  right: 0,
                                  width: 320,
                                  zIndex: 40,
                                  padding: 12,
                                  background: '#ffffff',
                                  borderRadius: 8,
                                  boxShadow: '0 6px 18px rgba(15, 23, 42, 0.12)'
                                }}>
                                  <div style={{ marginBottom: 8 }}>
                                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>Alergénios</h4>
                                    <div style={{ height: 6 }} />
                                    {meal.allergens && meal.allergens.length > 0 ? (
                                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {meal.allergens.map((a) => (
                                          <span key={String(a)} style={{ background: '#1f2937', color: '#fff', padding: '6px 10px', borderRadius: 999, fontSize: 13 }}>{typeof a === 'number' || (!isNaN(Number(a)) && String(a).trim() !== '') ? `Allergen #${a}` : a}</span>
                                        ))}
                                      </div>
                                    ) : (
                                      <div style={{ color: '#6b7280' }}>Nenhum alergénio declarado.</div>
                                    )}
                                  </div>

                                  <div>
                                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>Nutrição</h4>
                                    <div style={{ height: 6 }} />
                                    {meal.nutrition && meal.nutrition.length > 0 ? (
                                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {meal.nutrition.map((n) => (
                                          <span key={n.typeId} style={{ background: '#111827', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 13 }}>
                                            {(() => {
                                              const val = typeof (n as any).value === 'number' ? (n as any).value : (typeof (n as any).grams === 'number' ? (n as any).grams : null);
                                              const unit = (n as any).unit || 'g';
                                              const displayVal = val === null || val === undefined ? '—' : (Math.round(val * 100) / 100).toString();
                                              return n.name ? `${n.name}: ${displayVal}${unit ? ' ' + unit : ''}` : `Type ${n.typeId}: ${displayVal}${unit ? ' ' + unit : ''}`;
                                            })()}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <div style={{ color: '#6b7280' }}>Sem informação nutricional.</div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                          </>
                        )}
                        
                        {/* Seção de Jantar */}
                        {dinner.length > 0 && (
                          <>
                            <div style={{ 
                              fontSize: "10px", 
                              fontWeight: 700, 
                              color: "#374151", 
                              marginTop: lunch.length > 0 ? "12px" : "8px",
                              marginBottom: "6px",
                              paddingTop: lunch.length > 0 ? "8px" : "0px",
                              paddingBottom: "4px",
                              borderTop: lunch.length > 0 ? "1px solid #e5e7eb" : "none",
                              borderBottom: "1px solid #e5e7eb"
                            }}>
                              JANTAR
                  </div>
                            <ul style={weekMenuStyles.mealList}>
                              {dinner.map((meal) => (
                          <li key={meal.id} style={weekMenuStyles.mealItem}>
                            <div style={weekMenuStyles.mealHeader}>
                              <span style={weekMenuStyles.mealName}>{meal.name}</span>
                              <span style={weekMenuStyles.mealTag}>
                                {meal.type || "Refeição"}
                              </span>
                            </div>
                            <p style={weekMenuStyles.mealDescription}>
                              {meal.dishName || "Prato não especificado"}
                            </p>
                            <div style={weekMenuStyles.mealActions}>
                              {reservations[meal.id]?.status === "active" ? (
                                <button
                                  style={{ ...weekMenuStyles.reserveButton, backgroundColor: "#dc2626" }}
                                  disabled={actionLoading === meal.id}
                                  onClick={async () => {
                                    const res = reservations[meal.id];
                                    if (!res) return;
                                    try {
                                      setActionLoading(meal.id);
                                      await reservationService.cancelReservation(res.id);
                                      const map = { ...reservations };
                                      delete map[meal.id];
                                      setReservations(map);
                                    } catch (err) {
                                      alert("Não foi possível desmarcar. Tente novamente.");
                                    } finally {
                                      setActionLoading(null);
                                    }
                                  }}
                                >
                                  {actionLoading === meal.id ? "A desmarcar..." : "Desmarcar"}
                                </button>
                              ) : (
                                <button
                                  style={weekMenuStyles.reserveButton}
                                  disabled={actionLoading === meal.id}
                                  onClick={() => {
                                    const qty = isNursingHome ? getQuantity(meal.id) : 1;
                                    const finalQty = typeof qty === "string" || qty < 1 ? 1 : qty;
                                    
                                    // Aviso de confirmação para 100 ou mais senhas
                                    if (finalQty >= 100) {
                                      setConfirmDialog({
                                        show: true,
                                        quantity: finalQty,
                                        onConfirm: () => {
                                          setConfirmDialog({ show: false, quantity: 0, onConfirm: () => {} });
                                          navigate("/reservation", {
                                            state: {
                                              mealId: meal.id,
                                              name: meal.name,
                                              dishName: meal.dishName,
                                              type: meal.type,
                                              date: meal.date || day.date,
                                              quantity: finalQty,
                                            },
                                          });
                                        },
                                      });
                                      return;
                                    }
                                    
                                    navigate("/reservation", {
                                      state: {
                                        mealId: meal.id,
                                        name: meal.name,
                                        dishName: meal.dishName,
                                        type: meal.type,
                                        date: meal.date || day.date,
                                        quantity: finalQty,
                                      },
                                    });
                                  }}
                                >
                                  Reservar
                                </button>
                              )}
                              
                              {isNursingHome && !reservations[meal.id]?.status && (
                                <div style={weekMenuStyles.quantityWrapper}>
                                  <span style={weekMenuStyles.quantityLabel}>Senhas</span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={getQuantity(meal.id)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (inputValue === "") {
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [meal.id]: "" as any,
                                        }));
                                        return;
                                      }
                                      const val = Number(inputValue);
                                      if (!Number.isNaN(val)) {
                                        const clampedValue = Math.max(1, val);
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [meal.id]: clampedValue,
                                        }));
                                      }
                                    }}
                                    style={weekMenuStyles.quantityInput}
                                  />
                                </div>
                              )}
                              
                              <button
                                onClick={() => setPopupMealId(p => p === meal.id ? null : meal.id)}
                                aria-label={popupMealId === meal.id ? "Fechar informação" : "Mostrar informação"}
                                title={popupMealId === meal.id ? "Fechar informação" : "Mostrar informação"}
                                style={weekMenuStyles.infoButton}
                              >
                                i
                              </button>

                              {popupMealId === meal.id && (
                                <div style={{
                                  position: 'absolute',
                                  top: 'calc(100% + 10px)',
                                  right: 0,
                                  width: 320,
                                  zIndex: 40,
                                  padding: 12,
                                  background: '#ffffff',
                                  borderRadius: 8,
                                  boxShadow: '0 6px 18px rgba(15, 23, 42, 0.12)'
                                }}>
                                  <div style={{ marginBottom: 8 }}>
                                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>Alergénios</h4>
                                    <div style={{ height: 6 }} />
                                    {meal.allergens && meal.allergens.length > 0 ? (
                                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {meal.allergens.map((a) => (
                                          <span key={String(a)} style={{ background: '#1f2937', color: '#fff', padding: '6px 10px', borderRadius: 999, fontSize: 13 }}>{typeof a === 'number' || (!isNaN(Number(a)) && String(a).trim() !== '') ? `Allergen #${a}` : a}</span>
                ))}
              </div>
                                    ) : (
                                      <div style={{ color: '#6b7280' }}>Nenhum alergénio declarado.</div>
                                    )}
                                  </div>

                                  <div>
                                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>Nutrição</h4>
                                    <div style={{ height: 6 }} />
                                    {meal.nutrition && meal.nutrition.length > 0 ? (
                                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {meal.nutrition.map((n) => (
                                          <span key={n.typeId} style={{ background: '#111827', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 13 }}>
                                            {(() => {
                                              const val = typeof (n as any).value === 'number' ? (n as any).value : (typeof (n as any).grams === 'number' ? (n as any).grams : null);
                                              const unit = (n as any).unit || 'g';
                                              const displayVal = val === null || val === undefined ? '—' : (Math.round(val * 100) / 100).toString();
                                              return n.name ? `${n.name}: ${displayVal}${unit ? ' ' + unit : ''}` : `Type ${n.typeId}: ${displayVal}${unit ? ' ' + unit : ''}`;
                                            })()}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <div style={{ color: '#6b7280' }}>Sem informação nutricional.</div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                            </ul>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal de Confirmação para 100+ senhas */}
      {confirmDialog.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={() => setConfirmDialog({ show: false, quantity: 0, onConfirm: () => {} })}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <AlertTriangle size={24} color="#f59e0b" />
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#111827',
                }}>
                  Confirmar Reserva
                </h3>
              </div>
            </div>
            
            <p style={{
              margin: '0 0 24px 0',
              fontSize: '14px',
              color: '#4b5563',
              lineHeight: '1.5',
            }}>
              Tem a certeza que deseja reservar <strong>{confirmDialog.quantity}</strong> senhas?
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}>
              <button
                onClick={() => setConfirmDialog({ show: false, quantity: 0, onConfirm: () => {} })}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#15803d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


