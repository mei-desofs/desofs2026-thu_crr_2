/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, LogOut, Box, Info, Leaf } from 'lucide-react';
import { supplierStyles } from './SupplierScreen.styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { notificationService } from '../../../services/notificationService';
import type { Notification } from '../../../models/Notification';
import { useEffect, useState } from 'react';

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Maria Santos";
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  const handleCheckEncomendas = () => {
    navigate('/orders');
  };

  const handleLogout = () => {
    // Lógica de logout
    navigate('/login');
  };

  useEffect(() => {
    // Fetch notifications with status "seent" for the supplier
    const allUserNotifications = notificationService.getByUserId(user.id);

    const unSeenNotifications = allUserNotifications.then((data) => {
      return data.filter((notification: Notification) => notification.status === "sent");
    });

    unSeenNotifications.then((data) => {
      setNotifications(data);
    }).catch((error) => {
      console.error("Erro ao buscar notificações:", error);
    });
  }, [user.id]);

  const handleMarkAsSeen = async (id: number) => {
    try {
      await notificationService.markAsSeen(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Erro ao marcar notificação como vista:", error);
    }
  };

  return (
    <div style={supplierStyles.pageContainer}>
      {/* Header */}
      <header style={supplierStyles.header}>
        <div style={supplierStyles.headerLeft}>
          <div style={supplierStyles.logoCircle()}><Leaf size={supplierStyles.logoIcon()} color='#16a34a' /></div>
          <div style={supplierStyles.headerInfo}>
            <h1 style={supplierStyles.headerTitle}>BioCantinas</h1>
            <p style={supplierStyles.headerSubtitle}>
              Bem-vindo, {userName}
            </p>
          </div>
        </div>
        <div style={supplierStyles.headerActions}>
          <div style={supplierStyles.notificationContainer}>
            <button
              style={supplierStyles.iconButton}
              onClick={toggleNotifications}
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span style={supplierStyles.notificationBadge}></span>
              )}
            </button>
            {showNotifications && (
              <div style={supplierStyles.notificationDropdown}>
                <div style={supplierStyles.notificationHeader}>
                  Notificações {notifications.length > 0 && `(${notifications.length})`}
                </div>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      style={supplierStyles.notificationItem}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={supplierStyles.notificationContent}>
                        <p style={supplierStyles.notificationTitle}>{notification.title}</p>
                        <p style={supplierStyles.notificationBody}>{notification.body}</p>
                      </div>
                      <div style={supplierStyles.notificationActions}>
                        <button
                          style={supplierStyles.markAsSeenButton}
                          onClick={() => handleMarkAsSeen(notification.id)}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#15803d';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#16a34a';
                          }}
                        >
                          Marcar como vista
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={supplierStyles.emptyNotifications}>
                    Sem notificações novas
                  </div>
                )}
              </div>
            )}
          </div>
          <button style={supplierStyles.iconButton} onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={supplierStyles.mainContent}>
        <div style={supplierStyles.welcomeSection}>
          <h2 style={supplierStyles.welcomeTitle}>
            Bem-vindo, {userName}
          </h2>
          <p style={supplierStyles.welcomeDescription}>
            Aceda às suas encomendas e aos seus produtos disponíveis.
          </p>
        </div>

        <div
          style={supplierStyles.card}
          onClick={handleCheckEncomendas}
        >
          <div style={supplierStyles.cardIcon}>
            <Box size={32} color="#16a34a" />
          </div>
          <div style={supplierStyles.cardContent}>
            <h3 style={supplierStyles.cardTitle}>Ver Encomendas</h3>
            <p style={supplierStyles.cardDescription}>
              Consulte e gere as encomendas dos clientes.
            </p>
          </div>
          <div style={supplierStyles.cardArrow}>›</div>
        </div>

        {/* Produtos Disponíveis Card */}
        <div style={supplierStyles.infoCard}>
          <div style={supplierStyles.infoIconWrapper}>
            <Info size={24} color="#16a34a" />
          </div>
          <div style={supplierStyles.infoContent}>
            <h3 style={supplierStyles.infoTitle}>Produtos Disponíveis</h3>
            <p style={supplierStyles.infoDescription}>
              Veja e atualize os produtos que tem disponíveis para encomenda.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}