import { Bell, LogOut, BarChart3, Info, Leaf } from 'lucide-react';
import { refectoryManagerStyles } from './RefectoryManagerScreen.styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function RefectoryManagerDashboard() {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user);
    const userName = user ? user.name : "Gestor";
    const refeitorioName = user?.refeitorio?.name || "Refeitório";

    const handleViewStatistics = () => {
        navigate('/statistics-dashboard');
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div style={refectoryManagerStyles.pageContainer}>
            {/* Header */}
            <header style={refectoryManagerStyles.header}>
                <div style={refectoryManagerStyles.headerLeft}>
                    <div style={refectoryManagerStyles.logoCircle()}>
                        <Leaf size={refectoryManagerStyles.logoIcon()} color='#16a34a' />
                    </div>
                    <div style={refectoryManagerStyles.headerInfo}>
                        <h1 style={refectoryManagerStyles.headerTitle}>BioCantinas</h1>
                        <p style={refectoryManagerStyles.headerSubtitle}>
                            {refeitorioName} - {userName}
                        </p>
                    </div>
                </div>
                <div style={refectoryManagerStyles.headerActions}>
                    <button style={refectoryManagerStyles.iconButton}>
                        <Bell size={20} />
                    </button>
                    <button style={refectoryManagerStyles.iconButton} onClick={handleLogout}>
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={refectoryManagerStyles.mainContent}>
                <div style={refectoryManagerStyles.welcomeSection}>
                    <h2 style={refectoryManagerStyles.welcomeTitle}>
                        Bem-vindo, {userName}
                    </h2>
                    <p style={refectoryManagerStyles.welcomeDescription}>
                        Gerencie o refeitório <strong>{refeitorioName}</strong>, visualize estatísticas de desempenho e acompanhe os indicadores chave de desempenho (KPIs) do refeitório.
                    </p>
                </div>

                {/* Ver Estatísticas Card */}
                <div
                    style={refectoryManagerStyles.card}
                    onClick={handleViewStatistics}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    <div style={refectoryManagerStyles.cardIcon}>
                        <BarChart3 size={32} color="#16a34a" />
                    </div>
                    <div style={refectoryManagerStyles.cardContent}>
                        <h3 style={refectoryManagerStyles.cardTitle}>Ver Estatísticas</h3>
                        <p style={refectoryManagerStyles.cardDescription}>
                            Visualize os KPIs do refeitório, incluindo desperdício, reservas consumidas e não consumidas, e outros indicadores de desempenho
                        </p>
                    </div>
                    <div style={refectoryManagerStyles.cardArrow}>›</div>
                </div>

                {/* Informação Card */}
                <div style={refectoryManagerStyles.infoCard}>
                    <div style={refectoryManagerStyles.infoIconWrapper}>
                        <Info size={24} color="#16a34a" />
                    </div>
                    <div style={refectoryManagerStyles.infoContent}>
                        <h3 style={refectoryManagerStyles.infoTitle}>Gestão de Refeitório</h3>
                        <p style={refectoryManagerStyles.infoDescription}>
                            Como gestor de refeitório, pode visualizar os indicadores chave de desempenho (KPIs) do seu refeitório, incluindo métricas de desperdício, consumo de refeições e eficiência operacional.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

