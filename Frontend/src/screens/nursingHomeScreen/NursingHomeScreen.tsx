import { Bell, LogOut, Calendar, Info, Leaf } from "lucide-react";
import { nursingHomeStyles } from "./NursingHomeScreen.styles";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { menuService } from "../../services/menuService";
import type { WeekMenu } from "../../services/menuService";

export default function NursingHomeDashboard() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Nursing Home";
  const [menu, setMenu] = useState<WeekMenu | null>(null);
  const [loading, setLoading] = useState(true);

  const handleViewMenus = () => {
    navigate("/weekmenu");
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await menuService.getCurrentWeekMenu();
        if (mounted) setMenu(data);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div style={nursingHomeStyles.pageContainer}>
      {/* Header */}
      <header style={nursingHomeStyles.header}>
        <div style={nursingHomeStyles.headerLeft}>
          <div style={nursingHomeStyles.logoCircle()}>
            <Leaf size={nursingHomeStyles.logoIcon()} color="#16a34a" />
          </div>
          <div style={nursingHomeStyles.headerInfo}>
            <h1 style={nursingHomeStyles.headerTitle}>BioCantinas</h1>
            <p style={nursingHomeStyles.headerSubtitle}>Bem-vindo, {userName}</p>
          </div>
        </div>
        <div style={nursingHomeStyles.headerActions}>
          <button style={nursingHomeStyles.iconButton}>
            <Bell size={20} />
          </button>
          <button style={nursingHomeStyles.iconButton} onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={nursingHomeStyles.mainContent}>
        <div style={nursingHomeStyles.welcomeSection}>
          <h2 style={nursingHomeStyles.welcomeTitle}>Área Nursing Home</h2>
          <p style={nursingHomeStyles.welcomeDescription}>
            Consulte os menus semanais e acompanhe as refeições planeadas para os residentes.
          </p>
        </div>

        <div style={nursingHomeStyles.card} onClick={handleViewMenus}>
          <div style={nursingHomeStyles.cardIcon}>
            <Calendar size={32} color="#16a34a" />
          </div>
          <div style={nursingHomeStyles.cardContent}>
            <h3 style={nursingHomeStyles.cardTitle}>Ver Menus</h3>
            <p style={nursingHomeStyles.cardDescription}>
              Consulte os menus semanais disponíveis para a instituição.
            </p>
          </div>
          <div style={nursingHomeStyles.cardArrow}>›</div>
        </div>

        <div style={nursingHomeStyles.infoCard}>
          <div style={nursingHomeStyles.infoIconWrapper}>
            <Info size={24} color="#16a34a" />
          </div>
          <div style={nursingHomeStyles.infoContent}>
            <h3 style={nursingHomeStyles.infoTitle}>Informação Nutricional</h3>
            <p style={nursingHomeStyles.infoDescription}>
              Detalhes de alergénios e nutrição disponíveis em cada refeição apresentada nos menus.
            </p>
            
          </div>
        </div>
      </main>
    </div>
  );
}

