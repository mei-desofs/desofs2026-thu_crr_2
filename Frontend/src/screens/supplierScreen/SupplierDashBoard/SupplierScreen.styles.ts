const isMobile = () => window.innerWidth < 640;

export const supplierStyles = {
  // Page Container
  pageContainer: {
    minHeight: '100vh',
    height: 'auto',
    width: '100vw',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    margin: 0,
    padding: 0,
    boxSizing: 'border-box' as const,
    overflow: 'auto'
  },

  // Header
  header: {
    backgroundColor: '#16a34a',
    color: 'white',
    padding: isMobile() ? '12px 16px' : '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    flexShrink: 0,
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  logoText: {
    color: '#16a34a',
    fontWeight: '700' as const,
    fontSize: isMobile() ? '18px' : '20px',
  },

  headerInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
  },

  headerTitle: {
    fontWeight: '700' as const,
    fontSize: isMobile() ? '14px' : '18px',
    marginBottom: '2px',
    margin: 0,
  },

  headerSubtitle: {
    fontSize: isMobile() ? '12px' : '14px',
    color: '#bbf7d0',
    margin: 0,
  },

  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile() ? '8px' : '16px',
  },

  // Main Content
  mainContent: {
    flex: 1,
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile() ? '24px 16px' : '48px 24px',
    boxSizing: 'border-box' as const,
    overflow: 'auto',
  },

  // Welcome Section
  welcomeSection: {
    marginBottom: isMobile() ? '32px' : '48px',
  },

  welcomeTitle: {
    fontSize: isMobile() ? '24px' : '32px',
    fontWeight: '700' as const,
    color: '#1f2937',
    margin: '0 0 12px 0',
  },

  welcomeDescription: {
    fontSize: isMobile() ? '14px' : '16px',
    color: '#6b7280',
    lineHeight: '1.6',
    margin: 0,
    maxWidth: '800px',
  },

  // Criar Menus Card
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '20px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: isMobile() ? '16px' : '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '24px',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,

  cardIcon: {
    width: isMobile() ? '48px' : '56px',
    height: isMobile() ? '48px' : '56px',
    backgroundColor: '#dcfce7',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: isMobile() ? '16px' : '20px',
    fontWeight: '600' as const,
    color: '#1f2937',
    margin: '0 0 6px 0',
  },

  cardDescription: {
    fontSize: isMobile() ? '13px' : '14px',
    color: '#6b7280',
    margin: 0,
  },

  cardArrow: {
    fontSize: '32px',
    color: '#d1d5db',
    fontWeight: '300' as const,
  },

  // Info Card
  infoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '20px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    gap: isMobile() ? '16px' : '20px',
    boxSizing: 'border-box' as const,
  },

  infoIconWrapper: {
    width: isMobile() ? '40px' : '48px',
    height: isMobile() ? '40px' : '48px',
    backgroundColor: '#dcfce7',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: isMobile() ? '16px' : '18px',
    fontWeight: '600' as const,
    color: '#1f2937',
    margin: '0 0 8px 0',
  },

  infoDescription: {
    fontSize: isMobile() ? '13px' : '14px',
    color: '#6b7280',
    lineHeight: '1.6',
    margin: 0,
  },

  logoCircle: () => ({
    backgroundColor: '#ffffffff',
    borderRadius: '50%',
    width: isMobile() ? '30px' : '45px',
    height: isMobile() ? '30px' : '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  }),

  logoIcon: () => isMobile() ? 20 : 28,
  
   iconButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    padding: isMobile() ? '6px' : '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  } as React.CSSProperties,

  notificationBadge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '8px',
    height: '8px',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
    border: '2px solid #16a34a',
  } as React.CSSProperties,

  notificationContainer: {
    position: 'relative',
  } as React.CSSProperties,

  notificationDropdown: {
    position: "absolute" as const,
    top: "50px",
    right: "0px",
    width: isMobile() ? "280px" : "340px",
    maxHeight: "450px",
    overflowY: "auto" as const,
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    zIndex: 1000,
  },

  notificationHeader: {
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: '600' as const,
    fontSize: "16px",
    color: "#1f2937",
    backgroundColor: "#f9fafb",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
  },

  notificationItem: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    padding: "16px",
    borderBottom: "1px solid #f3f4f6",
    color: '#1f2937',
    transition: "background-color 0.2s",
    cursor: "pointer",
  } as React.CSSProperties,

  notificationContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },

  notificationTitle: {
    fontWeight: '600' as const,
    fontSize: "14px",
    color: "#1f2937",
    margin: 0,
  },

  notificationBody: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
    lineHeight: "1.4",
  },

  notificationActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "4px",
  },

  markAsSeenButton: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: '500' as const,
    cursor: "pointer",
    transition: "background-color 0.2s",
  } as React.CSSProperties,

  emptyNotifications: {
    padding: "32px 16px",
    textAlign: "center" as const,
    color: "#9ca3af",
    fontSize: "14px",
  },
};