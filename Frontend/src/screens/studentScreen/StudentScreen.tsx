import { Bell, LogOut, Calendar, Info, Leaf } from 'lucide-react';
import { studentStyles } from './StudentScreen.styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function StudentDashboard() {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user);
    const userName = user ? user.name : "João Silva";

    const handleViewMenus = () => {
        navigate('/weekmenu');
    };

    const handleLogout = () => {

        navigate('/login');
    };

    return (
        <div style={studentStyles.pageContainer}>
            {/* Header */}
            <header style={studentStyles.header}>
                <div style={studentStyles.headerLeft}>
                    <div style={studentStyles.logoCircle()}><Leaf size={studentStyles.logoIcon()} color='#16a34a' /></div>
                    <div style={studentStyles.headerInfo}>
                        <h1 style={studentStyles.headerTitle}>BioCantinas</h1>
                        <p style={studentStyles.headerSubtitle}>
                            Bem-vindo, {userName}
                        </p>
                    </div>
                </div>
                <div style={studentStyles.headerActions}>
                    <button style={studentStyles.iconButton}>
                        <Bell size={20} />
                    </button>
                    <button style={studentStyles.iconButton} onClick={handleLogout}>
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={studentStyles.mainContent}>
                <div style={studentStyles.welcomeSection}>
                    <h2 style={studentStyles.welcomeTitle}>
                        Bem-vindo, {userName}
                    </h2>
                    <p style={studentStyles.welcomeDescription}>
                        Consulte os menus semanais da cantina, faça as suas reservas e descubra informações sobre os ingredientes e valores nutricionais das refeições.
                    </p>
                </div>

                <div
                    style={studentStyles.card}
                    onClick={handleViewMenus}
                >
                    <div style={studentStyles.cardIcon}>
                        <Calendar size={32} color="#16a34a" />
                    </div>
                    <div style={studentStyles.cardContent}>
                        <h3 style={studentStyles.cardTitle}>Ver Menus</h3>
                        <p style={studentStyles.cardDescription}>
                            Consulte os menus semanais disponíveis na cantina
                        </p>
                    </div>
                    <div style={studentStyles.cardArrow}>›</div>
                </div>

                {/* Informação Card */}
                <div style={studentStyles.infoCard}>
                    <div style={studentStyles.infoIconWrapper}>
                        <Info size={24} color="#16a34a" />
                    </div>
                    <div style={studentStyles.infoContent}>
                        <h3 style={studentStyles.infoTitle}>Informação Nutricional</h3>
                        <p style={studentStyles.infoDescription}>
                            Todas as refeições são preparadas com ingredientes orgânicos e informações detalhadas sobre alergénios e valores nutricionais estão disponíveis.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}