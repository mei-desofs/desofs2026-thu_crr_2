/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { createMenuStyles } from './createMenuScreen.styles';
import { dishService } from '../../../services/dishService';
import { menuService } from '../../../services/menuService';
import type { WeekMenu } from '../../../services/menuService';
import { productService } from '../../../services/productService';
import type { Dish } from '../../../models/Dish';
import { mealService } from '../../../services/mealService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../../../../config';
import type { Product } from '../../../models/Product';
import type { Menu } from '../../../models/Menu';
import type { Canteen } from '../../../models/Canteen';

export default function CriarMenu() {
  const [weekId, setWeekId] = useState('1');
  const [menuTypeId, setMenuTypeId] = useState<1 | 2>(1);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const [canteenInfo, setCanteenInfo] = useState<{ name: string; idmenutype: number } | null>(null);

  const [mainProducts, setMainProducts] = useState<Record<string, Product[]>>({});
  const [organizedDishes, setOrganizedDishes] = useState<{ [key: number]: DishWithScore[] }>({ 1: [], 2: [], 3: [] });
  const [selectedMeals, setSelectedMeals] = useState<Record<string, { [key: number]: DishWithScore }>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [disabledWeeks, setDisabledWeeks] = useState<Record<string, boolean>>({});
  const [pendingWeeks, setPendingWeeks] = useState<Record<string, boolean>>({});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [editingMenuId, setEditingMenuId] = useState<number>(0);
  const [showValidatePopup, setShowValidatePopup] = useState<boolean>(false);
  const [existingMenu, setExistingMenu] = useState<Menu | null>(null);
  const [previewMenu, setPreviewMenu] = useState<WeekMenu | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [popupEditMode, setPopupEditMode] = useState<boolean>(false);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteenId, setSelectedCanteenId] = useState<number | null>(null);
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);
  interface DishWithScore {
    dish: Dish;
    score: number;
  }

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/canteens`) as { data: Canteen[] };
        setCanteens(res.data);
      } catch (err) {
        console.error("Erro ao buscar cantinas", err);
      }
    };
    fetchCanteens();
  }, []);

  useEffect(() => {
    const canteen = canteens.find(c => c.id === selectedCanteenId);
    if (canteen) {
      setMenuTypeId(canteen.idmenutype as 1 | 2);
    }
  }, [selectedCanteenId, canteens]);

  // --- Gera semanas ---
  const getNext52Weeks = () => {
    const weeks = [];
    const today = new Date();
    const currentMonday = new Date(today);
    const day = currentMonday.getDay();
    const diffToMonday = (day + 6) % 7;
    currentMonday.setDate(currentMonday.getDate() - diffToMonday);

    for (let i = 0; i < 52; i++) {
      const start = new Date(currentMonday.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
      const formatDate = (date: Date) => `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
      weeks.push({
        id: (i + 1).toString(),
        label: `${formatDate(start)} - ${formatDate(end)}`,
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      });
    }
    return weeks;
  };

  useEffect(() => {
    if (!menus.length || !weekId) return;

    const loadExistingMenu = async () => {
      const week = weeks.find(w => w.id === weekId);
      if (!week) return;

      const foundMenu = menus.find(menu => {
        const menuStart = new Date(menu.initialDate).toISOString().split('T')[0];
        const menuEnd = new Date(menu.finalDate).toISOString().split('T')[0];
        return menuStart === week.start && menuEnd === week.end;
      });

      if (foundMenu) {
        setEditingMenuId(foundMenu.id);
        setExistingMenu(foundMenu);
      } else {
        setEditingMenuId(0);
        setExistingMenu(null);
      }
    };

    loadExistingMenu();
  }, [menus, weekId]);

  const weeks = getNext52Weeks();

  const weekDays = useMemo(() => {
  return selectedCanteen?.idmenutype === 1
    ? [
        { id: 'monday', name: 'Segunda-feira' },
        { id: 'tuesday', name: 'Terça-feira' },
        { id: 'wednesday', name: 'Quarta-feira' },
        { id: 'thursday', name: 'Quinta-feira' },
        { id: 'friday', name: 'Sexta-feira' },
      ]
    : [
        { id: 'monday', name: 'Segunda-feira' },
        { id: 'tuesday', name: 'Terça-feira' },
        { id: 'wednesday', name: 'Quarta-feira' },
        { id: 'thursday', name: 'Quinta-feira' },
        { id: 'friday', name: 'Sexta-feira' },
        { id: 'saturday', name: 'Sábado' },
        { id: 'sunday', name: 'Domingo' },
      ];
}, [menuTypeId]);

  // --- Pré-seleção da primeira semana disponível ---
  const preSelectWeek = (disabledWeeks: Record<string, boolean>) => {
    if (!weeks.length) return;
    const today = new Date();
    const availableWeek = weeks.find(week => {
      const start = new Date(week.start);
      return start >= today && !disabledWeeks[week.id];
    });
    if (availableWeek) setWeekId(availableWeek.id);
    else setWeekId(weeks[weeks.length - 1].id);
  };

  // --- Seleção de prato ---
  const handleSelectMeal = async (dayId: string, dishTypeId: number, dishItem: DishWithScore) => {
    setSelectedMeals(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], [dishTypeId]: dishItem }
    }));
    setOpenDropdown(null);

    const ids = dishItem.dish?.mainProductsId;
    if (!ids || ids.length === 0) {
      setMainProducts(prev => ({ ...prev, [`${dayId}-${dishTypeId}`]: [] }));
      return;
    }

    try {
      const products = await Promise.all(ids.map(id => productService.getProductById(id)));
      setMainProducts(prev => ({ ...prev, [`${dayId}-${dishTypeId}`]: products }));
    } catch (err) {
      console.error("Erro ao buscar produtos principais:", err);
    }
  };

  // --- Buscar informação da cantina ---
  useEffect(() => {
    const fetchCanteenInfo = async () => {
      if (!user?.canteenId) return;
      
      try {
        const canteenResponse = await axios.get(`${API_BASE_URL}/canteens/${selectedCanteenId}`);
        const canteen = canteenResponse.data;
        setSelectedCanteen(canteen);
        
        if (canteen) {
          // idmenutype: 1 = Menu 5 dias (escola), 2 = Menu 7 dias (lar)
          const canteenMenuTypeId = canteen.idmenutype || canteen.menuType?.id || 1;
          
          setCanteenInfo({
            name: canteen.name,
            idmenutype: canteenMenuTypeId
          });
          
          // Definir o menuTypeId inicial baseado no idmenutype da cantina
          setMenuTypeId(canteenMenuTypeId as 1 | 2);
        }
      } catch (err) {
        console.error('Erro ao buscar informação da cantina:', err);
      }
    };
    
    fetchCanteenInfo();
  }, [selectedCanteenId]);

  const fetchMenus = async () => {
    if (!selectedCanteenId) return;
    try {
      const menus = selectedCanteenId? await menuService.getMenusByCanteen(selectedCanteenId) : [];
      setMenus(menus);

      const disabledWeeks: Record<string, boolean> = {}; // já publicados
      const pendingWeeks: Record<string, boolean> = {};  // pendentes

      menus.forEach(menu => {
        const menuDate = new Date(menu.initialDate);
        const weekIndex = weeks.findIndex(w => {
          const start = new Date(w.start);
          const end = new Date(w.end);
          return menuDate >= start && menuDate <= end;
        });

        if (weekIndex >= 0) {
          const weekId = weeks[weekIndex].id;
          if (menu.status === 'published') disabledWeeks[weekId] = true;
          else if (menu.status === 'pending') pendingWeeks[weekId] = true;
          else if (menu.status === 'aproved') pendingWeeks[weekId] = true; // continua editável
        }
      });

      setDisabledWeeks(disabledWeeks);
      setPendingWeeks(pendingWeeks);

      preSelectWeek(disabledWeeks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!selectedCanteenId) return;
    fetchMenus();
  }, [selectedCanteenId]);

  // When opening the validate popup, attempt to load a preview of the menu
  useEffect(() => {
    let mounted = true;
    const loadPreview = async () => {
      if (!showValidatePopup) return;
      setPreviewLoading(true);
      try {
        if (existingMenu && existingMenu.id) {
          // request aggregated menu for the selected week
          // compute weekOffset relative to current week
          const today = new Date();
          const currentWeekIndex = weeks.findIndex(w => {
            const start = new Date(w.start);
            const end = new Date(w.end);
            return today >= start && today <= end;
          });
          const selectedIndex = weeks.findIndex(w => w.id === weekId);
          const weekOffset = (selectedIndex >= 0 && currentWeekIndex >= 0) ? selectedIndex - currentWeekIndex : 0;
          const data = await menuService.getCurrentWeekMenu(menuTypeId, weekOffset);
          if (mounted) setPreviewMenu(data);
        } else {
          if (mounted) setPreviewMenu(null);
        }
      } catch {
        if (mounted) setPreviewMenu(null);
      } finally {
        if (mounted) setPreviewLoading(false);
      }
    };
    loadPreview();
    return () => { mounted = false; };
  }, [showValidatePopup, existingMenu, weekId, menuTypeId]);


  // --- Buscar pratos recomendados ---
  useEffect(() => {
    const fetchDishes = async () => {
      const week = weeks.find(w => w.id === weekId);
      if (!week) return;

      const dishList: DishWithScore[] = await dishService.recomendationsDishes(week.start);
      const organized: { [key: number]: DishWithScore[] } = { 1: [], 2: [], 3: [] };
      dishList.forEach(item => organized[item.dish.dishTypeId].push(item));
      Object.keys(organized).forEach(type => organized[parseInt(type)].sort((a, b) => b.score - a.score));
      setOrganizedDishes(organized);

      const existingMenu = menus.find(menu => {
        const menuStart = new Date(menu.initialDate).toISOString().split('T')[0];
        const menuEnd = new Date(menu.finalDate).toISOString().split('T')[0];
        return menuStart === week.start && menuEnd === week.end;
      });

      if (existingMenu) {
        setEditingMenuId(existingMenu.id);
        setExistingMenu(existingMenu);

        // Pré-seleção baseada no menu existente
        const updatedWeekDays = existingMenu.menuTypeId === 1
          ? weekDays.slice(0,5)
          : weekDays.slice(0,7);

        const mealsData = await Promise.all(
          existingMenu.meals.map(mealId => mealService.getMealById(mealId))
        );

        const preSelected: Record<string, { [key: number]: DishWithScore }> = {};
        const mainProductsMap: Record<string, Product[]> = {};

        for (const meal of mealsData) {
          const mealDate = new Date(meal.date);
          const dayIndex = mealDate.getDay() === 0 ? 6 : mealDate.getDay() - 1;
          const day = updatedWeekDays[dayIndex];
          if (!day) continue;

          const dishItem = Object.values(organized).flat().find(d => d.dish.id === meal.dishId);
          if (!dishItem) continue;

          const typeId = meal.mealTypeId === 1 ? dishItem.dish.dishTypeId : dishItem.dish.dishTypeId + 3;

          if (!preSelected[day.id]) preSelected[day.id] = {};
          preSelected[day.id][typeId] = dishItem;

          // Buscar produtos principais do prato
          const ids = dishItem.dish?.mainProductsId || [];
          if (ids.length > 0) {
            try {
              const products = await Promise.all(ids.map(id => productService.getProductById(id)));
              mainProductsMap[`${day.id}-${typeId}`] = products;
            } catch (err) {
              console.error("Erro ao buscar produtos principais:", err);
              mainProductsMap[`${day.id}-${typeId}`] = [];
            }
          } else {
            mainProductsMap[`${day.id}-${typeId}`] = [];
          }
        }

        setSelectedMeals(preSelected);
        setMainProducts(mainProductsMap);
        return; // não fazer autofill
      }

      // --- Auto-seleção caso não exista menu ---
      const autoSelected: Record<string, { [key: number]: DishWithScore }> = {};
      const mainProductsMap: Record<string, Product[]> = {};
      const counters: Record<number, number> = {1: 0, 2: 0, 3: 0};
      const daysToUse = menuTypeId === 1 ? weekDays.slice(0,5) : weekDays.slice(0,7);
      const mealTypeIds = menuTypeId === 1 ? [1,2,3] : [1,2,3,4,5,6];

      for (const day of daysToUse) {
        autoSelected[day.id] = {};

        for (const typeId of mealTypeIds) {
          const organizedKey = typeId <= 3 ? typeId : typeId - 3;
          const dishesArray = organized[organizedKey];
          const dishItem = dishesArray[counters[organizedKey] % dishesArray.length];

          autoSelected[day.id][typeId] = dishItem;

          // Buscar produtos principais
          const ids = dishItem.dish?.mainProductsId || [];
          if (ids.length > 0) {
            try {
              const products = await Promise.all(ids.map(id => productService.getProductById(id)));
              mainProductsMap[`${day.id}-${typeId}`] = products;
            } catch (err) {
              console.error("Erro ao buscar produtos principais:", err);
              mainProductsMap[`${day.id}-${typeId}`] = [];
            }
          } else {
            mainProductsMap[`${day.id}-${typeId}`] = [];
          }

          counters[organizedKey]++;
        }
      }

      setSelectedMeals(autoSelected);
      setMainProducts(mainProductsMap);
    };

    fetchDishes();
  }, [weekId, menuTypeId, menus]);


  const toggleDropdown = (key: string) => setOpenDropdown(openDropdown === key ? null : key);
  const handleCancel = () => alert('Cancelar');

  const renderMealDropdown = (dayId: string, typeId: number) => {
    const mealName = typeId <= 3 ? (typeId===1?'Carne':typeId===2?'Peixe':'Vegetariano') : (typeId===4?'Carne':typeId===5?'Peixe':'Vegetariano');
    const organizedKey = typeId <= 3 ? typeId : typeId - 3;

    return (
      <div key={typeId} style={createMenuStyles.mealTypeSection}>
        <div style={{ marginBottom:'4px', fontWeight:'bold', color:'#4b5563', fontSize:'14px' }}>{mealName}</div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ position:'relative', flex:1 }}>
            <button onClick={()=>toggleDropdown(`${dayId}-${typeId}`)} style={{...createMenuStyles.dropdownButton, ...(selectedMeals[dayId]?.[typeId]?createMenuStyles.dropdownButtonSelected:{})}}>
              <span>{selectedMeals[dayId]?.[typeId]?.dish.name || 'Selecionar prato'}</span>
              {openDropdown === `${dayId}-${typeId}` ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>

            {openDropdown === `${dayId}-${typeId}` && (
              <div style={createMenuStyles.dropdownMenu}>
                {organizedDishes[organizedKey]?.map(item => (
                  <div key={item.dish.id} style={createMenuStyles.dropdownItem} onClick={()=>handleSelectMeal(dayId,typeId,item)} onMouseEnter={e=>e.currentTarget.style.backgroundColor='#f9fafb'} onMouseLeave={e=>e.currentTarget.style.backgroundColor='white'}>
                    {item.dish.name} <span style={createMenuStyles.scoreChip}>★ {item.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedMeals[dayId]?.[typeId] && (
          <div style={createMenuStyles.selectedDishInfo}>
            <div style={createMenuStyles.ingredientsTitle}>Ingredientes Principais</div>
            <div style={createMenuStyles.ingredientsList}>
              {(mainProducts[`${dayId}-${typeId}`] ?? []).length > 0 ? mainProducts[`${dayId}-${typeId}`].map(prod => <div key={prod.id}>- {prod.name}</div>) : <span style={{fontSize:'12px', color:'#6b7280'}}>Sem produtos principais</span>}
            </div>
          </div>
        )}
      </div>
    );
  }


  // --- Criar menu ---
  const handleCreateMenu = async () => {

  if (!selectedCanteenId) {
    return alert("Selecione uma cantina.");
  }

  const daysToCreate =
    menuTypeId === 1
      ? weekDays.slice(0, 5)
      : weekDays;

  const allDaysComplete = daysToCreate.every(day => {
    const dayMeals = selectedMeals[day.id];
    return dayMeals && Object.values(dayMeals).length > 0;
  });

  if (!allDaysComplete) {
    return alert('Selecione todos os pratos para cada dia.');
  }

  try {
    const week = weeks.find(w => w.id === weekId);

    if (!week) return;

    // Buscar os refeitórios associados à cantina via API
    let refeitorioId: number | null = null;
    
    try {
      const canteenResponse = await axios.get(`${API_BASE_URL}/canteens/${selectedCanteenId}`);
      const canteen = canteenResponse.data;
      
      // Usar o primeiro refeitório associado à cantina
      if (canteen.refeitorios && canteen.refeitorios.length > 0) {
        refeitorioId = canteen.refeitorios[0].id;
      }
    } catch (err) {
      console.error('Erro ao buscar refeitórios da cantina:', err);
    }
    
    if (!refeitorioId) {
      return alert('Erro: Não foi possível determinar o refeitório. Certifique-se de que a cantina tem refeitórios associados.');
    }

    const createdMealsIds: number[] = [];
    const mealsToCreate = menuTypeId === 1 ? [1, 2, 3] : [1, 2, 3, 4, 5, 6];

    for (const dayIndex in daysToCreate) {
      const day = daysToCreate[dayIndex];

      const mealDate = new Date(
        new Date(week.start).getTime() +
        parseInt(dayIndex) * 24 * 60 * 60 * 1000
      );

      for (const typeId of mealsToCreate) {
        const mealSelection = selectedMeals[day.id]?.[typeId];

        if (!mealSelection) {
          console.warn(`⚠️ Sem seleção para tipo ${typeId}`);
          continue;
        }

        const mealPayload = {
          mealTypeId: typeId > 3 ? 2 : 1, // 1=Almoço, 2=Jantar
          name: mealSelection.dish.name,
          date: mealDate.toISOString().split("T")[0],
          dishId: mealSelection.dish.id,
          canteenId: selectedCanteenId,
          refeitorioId: refeitorioId,
        };

        const createdMeal = await mealService.createMeal(mealPayload);

        createdMealsIds.push(createdMeal.id);
      }

      console.groupEnd();
    }

    const menuPayload = {
      menuTypeId,
      initialDate: week.start,
      finalDate: week.end,
      meals: createdMealsIds,
      canteenId: selectedCanteenId? selectedCanteenId : user.canteenId,
    };

    const createdMenu = await menuService.createMenu(menuPayload);

    setEditingMenuId(createdMenu.id);
    setExistingMenu(createdMenu);
    alert("Menu criado com sucesso!");
    setShowValidatePopup(true);

  }catch (err: any) {
  console.error("💥 Backend error:", err.response?.data);
  alert(JSON.stringify(err.response?.data));

  } finally {
    console.log("=== FIM handleCreateMenu ===");
  }
};


  useEffect(() => {
    const validateMeals = () => {
      const alerts: string[] = [];
      const productUsage: Record<string, { count: number, days: string[] }> = {};

      weekDays.forEach((day) => {
        const dayMeals = selectedMeals[day.id];
        if (!dayMeals) return;

        Object.keys(dayMeals).forEach(typeId => {
          const products = mainProducts[`${day.id}-${typeId}`] || [];
          products.forEach(prod => {
            if (!productUsage[prod.name]) productUsage[prod.name] = { count: 0, days: [] };
            productUsage[prod.name].count++;
            productUsage[prod.name].days.push(day.name);
          });
        });
      });

      // Produtos em dias consecutivos
      weekDays.forEach((day, i) => {
        if (i === 0) return;
        const prevDay = weekDays[i - 1];
        const currentDayProducts = Object.values(selectedMeals[day.id] || {}).flatMap(m => mainProducts[`${day.id}-${m.dish.dishTypeId}`] || []);
        const prevDayProducts = Object.values(selectedMeals[prevDay.id] || {}).flatMap(m => mainProducts[`${prevDay.id}-${m.dish.dishTypeId}`] || []);
        const repeated = currentDayProducts.filter(p => prevDayProducts.some(pp => pp.id === p.id));
        repeated.forEach(p => alerts.push(`⚠ Produto "${p.name}" em dias consecutivos: ${prevDay.name} e ${day.name}`));
      });

      // Produtos repetidos >2x na semana
      Object.keys(productUsage).forEach(prodName => {
        if (productUsage[prodName].count > 2) {
          alerts.push(`⚠ Produto "${prodName}" aparece ${productUsage[prodName].count} vezes na ementa: ${productUsage[prodName].days.join(', ')}`);
        }
      });

      setWarnings(alerts);
    };

    validateMeals();
  }, [selectedMeals, mainProducts, weekDays]);

  const handleAproveMenu = async () => {
    try {
      // Chamada à API para publicar o menu
      console.log("Aprovado menu com ID:", editingMenuId);
      await menuService.updateMenuStatus(editingMenuId, 'aproved'); 
      alert("Menu aprovado com sucesso!");

      setShowValidatePopup(false);
      setEditingMenuId(0);
      setExistingMenu(null);
      fetchMenus(); // Recarrega os menus para atualizar o estado
    } catch (err) {
      console.error(err);
      alert("Erro ao aprovar menu.");
    }
  };

  const selectedWeekMenu = menus.find(m => {
  const s = new Date(m.initialDate).toISOString().split("T")[0];
    return s === weeks.find(w => w.id === weekId)?.start;
  });

  const handlePublishMenu = async () => {
    try {
      // Chamada à API para publicar o menu
      console.log("publicado menu com ID:", editingMenuId);
      await menuService.updateMenuStatus(editingMenuId, 'published'); 
      alert("Menu publicado com sucesso!");

      setShowValidatePopup(false);
      setEditingMenuId(0);
      setExistingMenu(null);
      fetchMenus(); // Recarrega os menus para atualizar o estado
    } catch (err) {
      console.error(err);
      alert("Erro ao publicar menu.");
    }
  };


  // --- JSX ---
  const today = new Date();
  const currentWeekIndex = weeks.findIndex(w => today >= new Date(w.start) && today <= new Date(w.end));
  const nextWeekIndex = currentWeekIndex >= 0 ? currentWeekIndex + 1 : 0;
  return (
    <div style={createMenuStyles.pageContainer}>
      <header style={createMenuStyles.header}>
        <button style={createMenuStyles.backButton} onClick={()=>navigate('/nutritionist-dashboard')}><ArrowLeft size={20}/></button>
        <div style={createMenuStyles.headerContent}>
          <h1 style={createMenuStyles.headerTitle}>Criar Ementas</h1>
          <p style={createMenuStyles.headerSubtitle}>
            {canteenInfo ? `Defina e publique as ementas semanais para ${canteenInfo.name}` : 'Defina e publique as ementas semanais'}
          </p>
        </div>
      </header>

      <main style={createMenuStyles.mainContent}>
        <div style={createMenuStyles.contentWrapper}>
          <div style={createMenuStyles.leftSection}>
            <div style={createMenuStyles.formCard}>
              <h2 style={createMenuStyles.sectionTitle}>Ementa</h2>
              <div style={createMenuStyles.formGroup}>
              <label style={createMenuStyles.label}>Cantina</label>
              <select
                value={selectedCanteenId ?? ""}
                onChange={e => setSelectedCanteenId(Number(e.target.value))}
                style={createMenuStyles.select}
              >
                <option value="">Selecione uma cantina</option>
                {canteens.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>


                <label style={createMenuStyles.label}>Semana</label>
                <select value={weekId} onChange={e => setWeekId(e.target.value)} style={createMenuStyles.select}>
                  {weeks.map((week, index) => {
                    let label = week.label;
                    const menuForWeek = menus.find(m => {
                    const s = new Date(m.initialDate).toISOString().split("T")[0];
                    return s === week.start;
                  });

                  if (menuForWeek?.status === 'published') label += ' (Menu publicado)';
                  else if (menuForWeek?.status === 'pending') label += ' (Menu pendente)';
                  else if (menuForWeek?.status === 'aproved') label += ' (Menu confirmado, falta publicar)';

                    return (
                      <option
                        key={week.id}
                        value={week.id}
                        disabled={index < nextWeekIndex || disabledWeeks[week.id] === true} // só desativa publicados
                      >
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <p style={createMenuStyles.sectionDescription}>
                Os pratos foram automaticamente preenchidos de acordo com os critérios definidos, pode alterar qualquer seleção.
                É possível utilizar o botão de "próxima sugestão" ao lado de cada seleção para alterar o prato para o próximo mais recomendado ou clicar na seleção para escolher manualmente.
              </p>

              {warnings.length > 0 && (
                <div style={{
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FBBF24',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  color: '#92400E',
                }}>
                  {warnings.map((w, i) => <div key={i}>{w}</div>)}
                </div>
              )}

              <div style={createMenuStyles.daysGrid}>
              {weekDays.slice(0, menuTypeId===1 ? 5 : 7).map((day) => (
                <div key={day.id} style={createMenuStyles.dayCard}>
                  <div style={createMenuStyles.dayName}>
                    {day.name}
                  </div>

                  {menuTypeId === 2 && (
                    <div style={{ fontWeight:'bold', margin:'8px 0 4px 0', color: '#4e4d4dff' }}>
                      Almoço
                    </div>
                  )}

                  {[1,2,3].map(typeId => renderMealDropdown(day.id, typeId))}

                  {menuTypeId === 2 && (
                    <>
                      <div style={createMenuStyles.mealPeriodDivider}>
                        <div style={{ fontWeight:'bold', color: '#4e4d4dff' }}>Jantar</div>
                      </div>
                      {[4,5,6].map(typeId => renderMealDropdown(day.id, typeId))}
                    </>
                  )}
                </div>
              ))}
              </div>
            </div>

            <div style={createMenuStyles.actionButtons}>

            {selectedWeekMenu?.status === 'aproved' ? (

              <button
                style={createMenuStyles.createButton}
                onClick={handlePublishMenu}
              >
                Publicar Ementa
              </button>

            ) : pendingWeeks[weekId] ? (

              <button
                style={createMenuStyles.createButton}
                onClick={() => { setShowValidatePopup(true); setPopupEditMode(false); }}
              >
                Validar ementa pendente
              </button>

            ) : editingMenuId == 0 ? (

              <>
                <button style={createMenuStyles.cancelButton} onClick={handleCancel}>
                  Cancelar
                </button>
                <button style={createMenuStyles.createButton} onClick={handleCreateMenu}>
                  Criar Ementa
                </button>
              </>

            ) : popupEditMode ? (

              <button
                style={createMenuStyles.createButton}
                onClick={() => { setShowValidatePopup(true); setPopupEditMode(false); }}
              >
                Validar Ementa
              </button>

            ) : (

              <>
                <button style={createMenuStyles.createButton}>
                  Editar Ementa
                </button>
                <button
                  style={createMenuStyles.createButton}
                  onClick={() => setShowValidatePopup(true)}
                >
                  Validar Ementa
                </button>
              </>

            )}

                {showValidatePopup && (
                  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.35)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: 10, width: '92%', maxWidth: 900, boxShadow: '0 8px 30px rgba(2,6,23,0.2)', display: 'flex', flexDirection: 'column', gap: 12, color: '#111827' }}>
                      <h3 style={{ margin: 0 }}>Validar Ementa</h3>
                      {previewLoading ? (
                        <div>Carregando preview...</div>
                      ) : previewMenu ? (
                        // Render backend aggregated menu preview (days -> meals -> allergens/nutrition)
                        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
                          {previewMenu.days.map((day) => (
                            <div key={day.date} style={{ marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #eef2f7' }}>
                              <div style={{ fontWeight: 700, marginBottom: 8, paddingBottom: 6, borderBottom: '1px dashed #e6eef6' }}>{new Date(day.date).toLocaleDateString('pt-PT', { weekday: 'long', day: '2-digit', month: '2-digit' })}</div>
                            {day.meals.map((meal) => {
                                const allergens = meal.allergens ?? [];
                                const nutrition = meal.nutrition ?? [];
                                return (
                                  <div key={meal.id} style={{ marginBottom: 10, padding: 8, borderRadius: 8, background: '#fbfdff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                                      <div style={{ fontWeight: 600, fontSize: 17 }}>{meal.name}</div>
                                      <div style={{ fontSize: 12, color: '#6b7280' }}>{meal.dishName || ''}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                      {allergens.length > 0 ? (allergens.map((a: any) => (
                                        <span key={String(a)} style={{ background: '#111827', color: '#fff', padding: '4px 8px', borderRadius: 999, fontSize: 12 }}>{a}</span>
                                      ))) : (<span style={{ color: '#6b7280', fontSize: 12 }}>Nenhum alergénio declarado.</span>)}
                                    </div>
                                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                      {nutrition.length > 0 ? (nutrition.map((n: any) => (
                                        <span key={n.typeId} style={{ background: '#0f1724', color: '#fff', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>
                                          {n.name ? `${n.name}: ${typeof n.value === 'number' ? (Math.round(n.value * 100) / 100) : (typeof n.grams === 'number' ? (Math.round(n.grams * 100) / 100) : '—')} ${n.unit || 'g'}` : `Type ${n.typeId}: ${n.value ?? n.grams ?? '—'}`}
                                        </span>
                                      ))) : (<span style={{ color: '#6b7280', fontSize: 12 }}>Sem informação nutricional.</span>)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Fallback: summary generated from current selections
                        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
                          <div style={{ marginBottom: 8, color: '#6b7280' }}>Nenhum menu publicado — a seguir está um resumo das suas seleções atuais.</div>
                          {weekDays.slice(0, menuTypeId===1 ? 5 : 7).map((day) => (
                            <div key={day.id} style={{ marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #eef2f7' }}>
                              <div style={{ fontWeight: 700, marginBottom: 6 }}>{day.name}</div>
                              {Object.keys(selectedMeals[day.id] || {}).map((typeKey) => {
                                const item = selectedMeals[day.id][Number(typeKey)];
                                return item ? (
                                  <div key={typeKey} style={{ marginBottom: 6 }}>
                                    <div style={{ fontWeight: 600 }}>{item.dish.name}</div>
                                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                                      Produtos principais: {(mainProducts[`${day.id}-${typeKey}`] || []).map(p => p.name).join(', ') || 'Sem produtos principais'}
                                    </div>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                        <button style={createMenuStyles.cancelButton} onClick={() => { setShowValidatePopup(false); setPopupEditMode(true); }}>Editar Ementa</button>
                        <button style={createMenuStyles.createButton} onClick={handleAproveMenu}>Aprovar Ementa</button>
                      </div>
                    </div>
                  </div>
                )}
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}