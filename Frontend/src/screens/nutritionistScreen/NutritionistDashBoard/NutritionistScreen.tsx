/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, LogOut, Calendar, Info, Leaf } from 'lucide-react';
import { nutritionistStyles } from './NutritionistScreen.styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function NutritionistDashboard() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Maria Santos";
  const canteenName = user?.canteen?.name || null;
  const refeitorioName = user?.refeitorio?.name || null;
  const locationName = canteenName || refeitorioName || "Sistema";

  const handleCreateMenu = () => {
    navigate('/create-menu');
  };

  const handleLogout = () => {
    // Lógica de logout
    navigate('/login');
  };

  return (
    <div style={nutritionistStyles.pageContainer}>
      {/* Header */}
      <header style={nutritionistStyles.header}>
        <div style={nutritionistStyles.headerLeft}>
          <div style={nutritionistStyles.logoCircle()}><Leaf size={nutritionistStyles.logoIcon()} color='#16a34a' /></div>
          <div style={nutritionistStyles.headerInfo}>
            <h1 style={nutritionistStyles.headerTitle}>BioCantinas</h1>
            <p style={nutritionistStyles.headerSubtitle}>
              {locationName} - {userName}
            </p>
          </div>
        </div>
        <div style={nutritionistStyles.headerActions}>
          <button style={nutritionistStyles.iconButton}>
            <Bell size={20} />
          </button>
          <button style={nutritionistStyles.iconButton} onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={nutritionistStyles.mainContent}>
        <div style={nutritionistStyles.welcomeSection}>
          <h2 style={nutritionistStyles.welcomeTitle}>
            Bem-vinda, {userName}
          </h2>
          <p style={nutritionistStyles.welcomeDescription}>
            {locationName !== "Sistema" && (
              <>Defina e publique os menus semanais para <strong>{locationName}</strong>, garantindo que as refeições cumprem os requisitos nutricionais, de alergénios e de alimentos orgânicos.</>
            )}
            {locationName === "Sistema" && (
              <>Defina e publique os menus semanais, garantindo que as refeições cumprem os requisitos nutricionais, de alergénios e de alimentos orgânicos.</>
            )}
          </p>
        </div>

        {/* Criar Menus Card */}
        <div
          style={nutritionistStyles.card}
          onClick={handleCreateMenu}
        >
          <div style={nutritionistStyles.cardIcon}>
            <Calendar size={32} color="#16a34a" />
          </div>
          <div style={nutritionistStyles.cardContent}>
            <h3 style={nutritionistStyles.cardTitle}>Criar Ementas</h3>
            <p style={nutritionistStyles.cardDescription}>
              Defina e publique as ementas semanais para as cantinas
            </p>
          </div>
          <div style={nutritionistStyles.cardArrow}>›</div>
        </div>

        {/* Trabalho em Equipa Card */}
        <div style={nutritionistStyles.infoCard}>
          <div style={nutritionistStyles.infoIconWrapper}>
            <Info size={24} color="#16a34a" />
          </div>
          <div style={nutritionistStyles.infoContent}>
            <h3 style={nutritionistStyles.infoTitle}>Histórico de menus</h3>
            <p style={nutritionistStyles.infoDescription}>
              Consulte os menus anteriores.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}