/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, LogOut, FileText, TrendingUp, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { statisticsStyles } from './StatisticsScreen.styles';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogout } from "../../../util/useLogout";

export default function StatisticsDashboard() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Utilizador";
  const navigate = useNavigate();

  const handleBioPercentage = () => {
    navigate("/bioPercentage-screen");
  };

  const handleWastePercentage = () => {
    navigate("/waste-percentage-screen");
  };

  const handlePerformance = () => {
    navigate("/performance");
  };

  const handleLogout = useLogout();

  const getCardStyle = (cardName: string) => ({
    ...statisticsStyles.card,
    transform: hoveredCard === cardName ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: hoveredCard === cardName
        ? '0 8px 16px rgba(0, 0, 0, 0.15)'
        : '0 2px 8px rgba(0, 0, 0, 0.1)',
  });

  return (
      <div style={statisticsStyles.pageContainer}>
        {/* Header */}
        <header style={statisticsStyles.header}>
          <div style={statisticsStyles.headerLeft}>
            <div style={statisticsStyles.logoCircle}>
              <span style={statisticsStyles.logoText}>B</span>
            </div>
            <div style={statisticsStyles.headerInfo}>
              <h1 style={statisticsStyles.headerTitle}>BioCantinas</h1>
              <p style={statisticsStyles.headerSubtitle}>
                Bem-vindo, {userName}
              </p>
            </div>
          </div>
          <div style={statisticsStyles.headerActions}>
            <button
                style={statisticsStyles.iconButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Bell size={20} />
            </button>
            <button
                style={statisticsStyles.iconButton}
                onClick={handleLogout}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main style={statisticsStyles.mainContent}>
          <div style={statisticsStyles.welcomeSection}>
            <h2 style={statisticsStyles.welcomeTitle}>
              Bem-vindo, {userName}
            </h2>
            <p style={statisticsStyles.welcomeDescription}>
              Verifique informação estatística referente a diversos pontos relacionados com o funcionamento, qualidade e desperdício.
            </p>
          </div>

          {/* Percentage of Bio Products for Recipe Card */}
          <div
              style={getCardStyle('bioPercentage')}
              onClick={handleBioPercentage}
              onMouseEnter={() => setHoveredCard('bioPercentage')}
              onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={statisticsStyles.cardIcon}>
              <FileText size={32} color="#16a34a" />
            </div>
            <div style={statisticsStyles.cardContent}>
              <h3 style={statisticsStyles.cardTitle}>Percentagem de Produtos Biológicos</h3>
              <p style={statisticsStyles.cardDescription}>
                Visualize a percentagem de produtos biológicos em cada receita
              </p>
            </div>
            <div style={statisticsStyles.cardArrow}>›</div>
          </div>

          {/* Waste Percentage Card */}
          <div
              style={getCardStyle('wastePercentage')}
              onClick={handleWastePercentage}
              onMouseEnter={() => setHoveredCard('wastePercentage')}
              onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={statisticsStyles.cardIcon}>
              <Trash2 size={32} color="#16a34a" />
            </div>
            <div style={statisticsStyles.cardContent}>
              <h3 style={statisticsStyles.cardTitle}>Percentagem de Desperdício</h3>
              <p style={statisticsStyles.cardDescription}>
                Visualize o desperdício de reservas não consumidas e desperdício de pratos por dia
              </p>
            </div>
            <div style={statisticsStyles.cardArrow}>›</div>
          </div>

          {/* Performance Card */}
          <div
              style={getCardStyle('performance')}
              onClick={handlePerformance}
              onMouseEnter={() => setHoveredCard('performance')}
              onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={statisticsStyles.cardIcon}>
              <TrendingUp size={32} color="#16a34a" />
            </div>
            <div style={statisticsStyles.cardContent}>
              <h3 style={statisticsStyles.cardTitle}>Desempenho</h3>
              <p style={statisticsStyles.cardDescription}>
                Visualize métricas e indicadores de desempenho da rede de fornecedores
              </p>
            </div>
            <div style={statisticsStyles.cardArrow}>›</div>
          </div>
        </main>
      </div>
  );
}