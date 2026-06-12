import { useLogout } from "../../../util/useLogout";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, LogOut, FileText, Users, BarChart3, TrendingUp, Package } from 'lucide-react';
import { useState } from 'react';
import { networkManagerStyles } from './NetworkScreen.styles';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NetworkManagerDashboard() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Utilizador";
  const navigate = useNavigate();

  const handleApplications = () => {
    navigate("/application-evaluation");
  };

  const handleSuppliers = () => {
    navigate("/suppliers-list");
  };

  const handleParishes = () => {
    navigate("/parishes-list");
  }

  const handleCanteenStatistics = () => {
    navigate("/network-canteen-statistics");
  };

  const handleRefectoryStatistics = () => {
    navigate("/network-refectory-statistics");
  };

  const handleProducerStatistics = () => {
    navigate("/network-producer-statistics");
  };

  const handleLogout = useLogout();

  const getCardStyle = (cardName: string) => ({
    ...networkManagerStyles.card,
    transform: hoveredCard === cardName ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: hoveredCard === cardName 
      ? '0 8px 16px rgba(0, 0, 0, 0.15)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
  });

  return (
    <div style={networkManagerStyles.pageContainer}>
      {/* Header */}
      <header style={networkManagerStyles.header}>
        <div style={networkManagerStyles.headerLeft}>
          <div style={networkManagerStyles.logoCircle}>
            <span style={networkManagerStyles.logoText}>B</span>
          </div>
          <div style={networkManagerStyles.headerInfo}>
            <h1 style={networkManagerStyles.headerTitle}>BioCantinas</h1>
            <p style={networkManagerStyles.headerSubtitle}>
              Bem-vindo, {userName}
            </p>
          </div>
        </div>
        <div style={networkManagerStyles.headerActions}>
          <button 
            style={networkManagerStyles.iconButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell size={20} />
          </button>
          <button 
            style={networkManagerStyles.iconButton} 
            onClick={handleLogout}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={networkManagerStyles.mainContent}>
        <div style={networkManagerStyles.welcomeSection}>
          <h2 style={networkManagerStyles.welcomeTitle}>
            Bem-vindo, {userName}
          </h2>
          <p style={networkManagerStyles.welcomeDescription}>
            Gerencie as candidaturas de fornecedores e mantenha a rede de parceiros atualizada, garantindo que apenas fornecedores qualificados fazem parte do sistema.
          </p>
        </div>

        {/* Candidaturas Card */}
        <div
          style={getCardStyle('applications')}
          onClick={handleApplications}
          onMouseEnter={() => setHoveredCard('applications')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={networkManagerStyles.cardIcon}>
            <FileText size={32} color="#16a34a" />
          </div>
          <div style={networkManagerStyles.cardContent}>
            <h3 style={networkManagerStyles.cardTitle}>Candidaturas</h3>
            <p style={networkManagerStyles.cardDescription}>
              Visualize e gerencie as candidaturas de novos fornecedores, aceitando ou rejeitando com comentários
            </p>
          </div>
          <div style={networkManagerStyles.cardArrow}>›</div>
        </div>

        {/* Lista de Fornecedores Card */}
        <div
          style={getCardStyle('suppliers')}
          onClick={handleSuppliers}
          onMouseEnter={() => setHoveredCard('suppliers')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={networkManagerStyles.cardIcon}>
            <Users size={32} color="#16a34a" />
          </div>
          <div style={networkManagerStyles.cardContent}>
            <h3 style={networkManagerStyles.cardTitle}>Lista de Fornecedores</h3>
            <p style={networkManagerStyles.cardDescription}>
              Consulte e gerencie a lista completa de fornecedores aprovados e ativos no sistema
            </p>
          </div>
          <div style={networkManagerStyles.cardArrow}>›</div>
        </div>

        {/* Lista de Freguesias Card */}
        <div
          style={getCardStyle('parishes')}
          onClick={handleParishes}
          onMouseEnter={() => setHoveredCard('parishes')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={networkManagerStyles.cardIcon}>
            <Users size={32} color="#16a34a" />
          </div>
          <div style={networkManagerStyles.cardContent}>
            <h3 style={networkManagerStyles.cardTitle}>Lista de Freguesias</h3>
            <p style={networkManagerStyles.cardDescription}>
              Consulte e gerencie a lista completa de Freguesias no sistema
            </p>
          </div>
          <div style={networkManagerStyles.cardArrow}>›</div>
        </div>

        {/* Estatísticas Cantinas Card */}
        <div
          style={getCardStyle('canteen-stats')}
          onClick={handleCanteenStatistics}
          onMouseEnter={() => setHoveredCard('canteen-stats')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={networkManagerStyles.cardIcon}>
            <BarChart3 size={32} color="#16a34a" />
          </div>
          <div style={networkManagerStyles.cardContent}>
            <h3 style={networkManagerStyles.cardTitle}>Estatísticas Cantinas</h3>
            <p style={networkManagerStyles.cardDescription}>
              Visualize os KPIs de produção das cantinas, incluindo pratos produzidos e ingredientes utilizados. Filtre por cantina.
            </p>
          </div>
          <div style={networkManagerStyles.cardArrow}>›</div>
        </div>

        {/* Estatísticas Refeitórios Card */}
        <div
          style={getCardStyle('refectory-stats')}
          onClick={handleRefectoryStatistics}
          onMouseEnter={() => setHoveredCard('refectory-stats')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={networkManagerStyles.cardIcon}>
            <TrendingUp size={32} color="#16a34a" />
          </div>
          <div style={networkManagerStyles.cardContent}>
            <h3 style={networkManagerStyles.cardTitle}>Estatísticas Refeitórios</h3>
            <p style={networkManagerStyles.cardDescription}>
              Visualize os KPIs de desempenho dos refeitórios, incluindo desperdício e consumo. Filtre por refeitório.
            </p>
          </div>
          <div style={networkManagerStyles.cardArrow}>›</div>
        </div>

        {/* Estatísticas Produtores Card */}
        <div
          style={getCardStyle('producer-stats')}
          onClick={handleProducerStatistics}
          onMouseEnter={() => setHoveredCard('producer-stats')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={networkManagerStyles.cardIcon}>
            <Package size={32} color="#16a34a" />
          </div>
          <div style={networkManagerStyles.cardContent}>
            <h3 style={networkManagerStyles.cardTitle}>Estatísticas Produtores</h3>
            <p style={networkManagerStyles.cardDescription}>
              Visualize os KPIs dos produtores, incluindo total de produtores, candidaturas e distribuição por status.
            </p>
          </div>
          <div style={networkManagerStyles.cardArrow}>›</div>
        </div>
      </main>
    </div>
  );
}