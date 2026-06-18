import { useLogout } from "../../../util/useLogout";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, LogOut, Box, Leaf } from 'lucide-react';
import { stockManagerStyles } from './StockManagerScreen.styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { notificationService } from '../../../services/notificationService';
import type { Notification } from '../../../models/Notification';
import { useEffect, useState } from 'react';

export default function StockManagerDashboard() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Maria Santos";
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  const handleNavigate = () => {
    navigate('/sm-orders');
  };

  const handleLogout = useLogout();

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
    <div style={stockManagerStyles.pageContainer}>
      {/* Header */}
      <header style={stockManagerStyles.header}>
        <div style={stockManagerStyles.headerLeft}>
          <div style={stockManagerStyles.logoCircle()}><Leaf size={stockManagerStyles.logoIcon()} color='#16a34a' /></div>
          <div style={stockManagerStyles.headerInfo}>
            <h1 style={stockManagerStyles.headerTitle}>BioCantinas</h1>
            <p style={stockManagerStyles.headerSubtitle}>
              Bem-vindo, {userName}
            </p>
          </div>
        </div>
        <div style={stockManagerStyles.headerActions}>
          <div style={stockManagerStyles.notificationContainer}>
            <button
              style={stockManagerStyles.iconButton}
              onClick={toggleNotifications}
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span style={stockManagerStyles.notificationBadge}></span>
              )}
            </button>
            {showNotifications && (
              <div style={stockManagerStyles.notificationDropdown}>
                <div style={stockManagerStyles.notificationHeader}>
                  Notificações {notifications.length > 0 && `(${notifications.length})`}
                </div>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      style={stockManagerStyles.notificationItem}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={stockManagerStyles.notificationContent}>
                        <p style={stockManagerStyles.notificationTitle}>{notification.title}</p>
                        <p style={stockManagerStyles.notificationBody}>{notification.body}</p>
                      </div>
                      <div style={stockManagerStyles.notificationActions}>
                        <button
                          style={stockManagerStyles.markAsSeenButton}
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
                  <div style={stockManagerStyles.emptyNotifications}>
                    Sem notificações novas
                  </div>
                )}
              </div>
            )}
          </div>
          <button style={stockManagerStyles.iconButton} onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={stockManagerStyles.mainContent}>
        <div style={stockManagerStyles.welcomeSection}>
          <h2 style={stockManagerStyles.welcomeTitle}>
            Bem-vindo, {userName}
          </h2>
          <p style={stockManagerStyles.welcomeDescription}>
            Aceda às suas encomendas e aos seus produtos disponíveis.
          </p>
        </div>

        <div
          style={stockManagerStyles.card}
          onClick={handleNavigate}
        >
          <div style={stockManagerStyles.cardIcon}>
            <Box size={32} color="#16a34a" />
          </div>
          <div style={stockManagerStyles.cardContent}>
            <h3 style={stockManagerStyles.cardTitle}>Ver Encomendas</h3>
            <p style={stockManagerStyles.cardDescription}>
              Consulte e gere as encomendas.
            </p>
          </div>
          <div style={stockManagerStyles.cardArrow}>›</div>
        </div>
      </main>
    </div>
  );
}