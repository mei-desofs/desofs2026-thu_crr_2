/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, LogOut, Users, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { canteenManagerStyles } from './canteenManagerScreen.styles';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

export default function CanteenManagerDashboard() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Utilizador";
  const [canteenName, setCanteenName] = useState<string>("Cantina");
  const navigate = useNavigate();

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
        }
      }
    };

    if (user) {
      fetchCanteenName();
    }
  }, [user?.canteenId, user?.canteen?.name, user]);

  const handleSuppliers = () => {
    navigate("/suppliers-list-cm");
  };

  const handleParishes = () => {
    navigate("/parishes-list-cm");
  };

  const handleStatistics = () => {
    navigate("/canteen-statistics");
  };

  const handleLogout = () => {
    // Logout logic
    navigate("/login");
  };

  const getCardStyle = (cardName: string) => ({
    ...canteenManagerStyles.card,
    transform: hoveredCard === cardName ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: hoveredCard === cardName 
      ? '0 8px 16px rgba(0, 0, 0, 0.15)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
  });

  return (
    <div style={canteenManagerStyles.pageContainer}>
      {/* Header */}
      <header style={canteenManagerStyles.header}>
        <div style={canteenManagerStyles.headerLeft}>
          <div style={canteenManagerStyles.logoCircle}>
            <span style={canteenManagerStyles.logoText}>B</span>
          </div>
          <div style={canteenManagerStyles.headerInfo}>
            <h1 style={canteenManagerStyles.headerTitle}>BioCantinas</h1>
            <p style={canteenManagerStyles.headerSubtitle}>
              {canteenName} - {userName}
            </p>
          </div>
        </div>
        <div style={canteenManagerStyles.headerActions}>
          <button 
            style={canteenManagerStyles.iconButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell size={20} />
          </button>
          <button 
            style={canteenManagerStyles.iconButton} 
            onClick={handleLogout}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={canteenManagerStyles.mainContent}>
        <div style={canteenManagerStyles.welcomeSection}>
          <h2 style={canteenManagerStyles.welcomeTitle}>
            Bem-vindo, {userName}
          </h2>
          <p style={canteenManagerStyles.welcomeDescription}>
            Gerencie a cantina <strong>{canteenName}</strong> e acompanhe os indicadores chave de desempenho (KPIs) da produção e entrega de refeições.
          </p>
        </div>

        {/* Lista de Fornecedores Card */}
        <div
          style={getCardStyle('suppliers')}
          onClick={handleSuppliers}
          onMouseEnter={() => setHoveredCard('suppliers')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={canteenManagerStyles.cardIcon}>
            <Users size={32} color="#16a34a" />
          </div>
          <div style={canteenManagerStyles.cardContent}>
            <h3 style={canteenManagerStyles.cardTitle}>Lista de Fornecedores</h3>
            <p style={canteenManagerStyles.cardDescription}>
              Consulte e gerencie a lista completa de fornecedores aprovados e ativos no sistema
            </p>
          </div>
          <div style={canteenManagerStyles.cardArrow}>›</div>
        </div>

        {/* Lista de Freguesias Card */}
        <div
          style={getCardStyle('parishes')}
          onClick={handleParishes}
          onMouseEnter={() => setHoveredCard('parishes')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={canteenManagerStyles.cardIcon}>
            <Users size={32} color="#16a34a" />
          </div>
          <div style={canteenManagerStyles.cardContent}>
            <h3 style={canteenManagerStyles.cardTitle}>Lista de Freguesias</h3>
            <p style={canteenManagerStyles.cardDescription}>
              Consulte e gerencie a lista completa de Freguesias ativas no sistema
            </p>
          </div>
          <div style={canteenManagerStyles.cardArrow}>›</div>
        </div>

        {/* Ver Estatísticas Card */}
        <div
          style={getCardStyle('statistics')}
          onClick={handleStatistics}
          onMouseEnter={() => setHoveredCard('statistics')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={canteenManagerStyles.cardIcon}>
            <BarChart3 size={32} color="#16a34a" />
          </div>
          <div style={canteenManagerStyles.cardContent}>
            <h3 style={canteenManagerStyles.cardTitle}>Ver Estatísticas</h3>
            <p style={canteenManagerStyles.cardDescription}>
              Visualize os KPIs da cantina, incluindo pratos produzidos, quantidade de ingredientes utilizados, receitas produzidas e outros indicadores de produção
            </p>
          </div>
          <div style={canteenManagerStyles.cardArrow}>›</div>
        </div>
      </main>
    </div>
  );
}