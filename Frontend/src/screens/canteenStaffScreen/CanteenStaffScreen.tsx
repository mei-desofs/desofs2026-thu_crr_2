import { Bell, LogOut, ClipboardList, Info, Leaf, BookOpen } from 'lucide-react';
import { canteenStaffStyles } from './CanteenStaffScreen.styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function RefectoryStaffDashboard() {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user);
    const userName = user ? user.name : "Funcionário";
    const refeitorioName = user?.refeitorio?.name || "Refeitório";

    const handleViewReservations = () => {
        navigate('/reservations-view');
    };

    const handleViewRecipes = () => {
        navigate('/bioPercentage-screen');
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div style={canteenStaffStyles.pageContainer}>
            {/* Header */}
            <header style={canteenStaffStyles.header}>
                <div style={canteenStaffStyles.headerLeft}>
                    <div style={canteenStaffStyles.logoCircle()}><Leaf size={canteenStaffStyles.logoIcon()} color='#16a34a' /></div>
                    <div style={canteenStaffStyles.headerInfo}>
                        <h1 style={canteenStaffStyles.headerTitle}>BioCantinas</h1>
                        <p style={canteenStaffStyles.headerSubtitle}>
                            {refeitorioName} - {userName}
                        </p>
                    </div>
                </div>
                <div style={canteenStaffStyles.headerActions}>
                    <button style={canteenStaffStyles.iconButton}>
                        <Bell size={20} />
                    </button>
                    <button style={canteenStaffStyles.iconButton} onClick={handleLogout}>
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={canteenStaffStyles.mainContent}>
                <div style={canteenStaffStyles.welcomeSection}>
                    <h2 style={canteenStaffStyles.welcomeTitle}>
                        Bem-vindo, {userName}
                    </h2>
                    <p style={canteenStaffStyles.welcomeDescription}>
                        Gerencie as marcações de refeições, visualize as reservas ativas e acompanhe o fluxo de utilizadores no refeitório <strong>{refeitorioName}</strong>.
                    </p>
                </div>

                <div
                    style={canteenStaffStyles.card}
                    onClick={handleViewReservations}
                >
                    <div style={canteenStaffStyles.cardIcon}>
                        <ClipboardList size={32} color="#16a34a" />
                    </div>
                    <div style={canteenStaffStyles.cardContent}>
                        <h3 style={canteenStaffStyles.cardTitle}>Ver Marcações</h3>
                        <p style={canteenStaffStyles.cardDescription}>
                            Consulte todas as reservas e marcações de refeições
                        </p>
                    </div>
                    <div style={canteenStaffStyles.cardArrow}>›</div>
                </div>

                <div
                    style={canteenStaffStyles.card}
                    onClick={handleViewRecipes}
                >
                    <div style={canteenStaffStyles.cardIcon}>
                        <BookOpen size={32} color="#16a34a" />
                    </div>
                    <div style={canteenStaffStyles.cardContent}>
                        <h3 style={canteenStaffStyles.cardTitle}>Receitas</h3>
                        <p style={canteenStaffStyles.cardDescription}>
                            Consulte todas as reservas e marcações de refeições
                        </p>
                    </div>
                    <div style={canteenStaffStyles.cardArrow}>›</div>
                </div>

                {/* Informação Card */}
                <div style={canteenStaffStyles.infoCard}>
                    <div style={canteenStaffStyles.infoIconWrapper}>
                        <Info size={24} color="#16a34a" />
                    </div>
                    <div style={canteenStaffStyles.infoContent}>
                        <h3 style={canteenStaffStyles.infoTitle}>Gestão de Reservas</h3>
                        <p style={canteenStaffStyles.infoDescription}>
                            Visualize e gerencie todas as marcações de refeições, acompanhe o estado das reservas e confirme o consumo das refeições.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

