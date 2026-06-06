const isMobile = () => window.innerWidth < 640;

export const visitorStyles = {
  // Page Container
  pageContainer: {
    minHeight: '100vh',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    margin: 0,
    padding: 0,
    boxSizing: 'border-box' as const,
    overflow: 'auto',
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
    paddingBottom: '1px',
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
  } as React.CSSProperties,

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
  },

  // Área Informativa da Candidatura
  infoArea: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: isMobile() ? '20px' : '28px',
    marginBottom: '24px',
    boxSizing: 'border-box' as const,
  },

  infoAreaHeader: {
    marginBottom: isMobile() ? '20px' : '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },

  infoAreaTitle: {
    fontSize: isMobile() ? '16px' : '18px',
    fontWeight: '600' as const,
    color: '#1f2937',
    margin: 0,
  },

  infoAreaDate: {
    fontSize: isMobile() ? '12px' : '13px',
    color: '#6b7280',
  },

  // Fluxo de Status
  flowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: isMobile() ? '8px' : '12px',
  },

  flowStepWrapper: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },

  flowStep: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: isMobile() ? '6px' : '8px',
    flex: 1,
  },

  flowIconCompleted: {
    width: isMobile() ? '36px' : '44px',
    height: isMobile() ? '36px' : '44px',
    borderRadius: '50%',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #16a34a',
  },

  flowIconCurrent: {
    width: isMobile() ? '36px' : '44px',
    height: isMobile() ? '36px' : '44px',
    borderRadius: '50%',
    backgroundColor: '#fef3c7',
    color: '#f59e0b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #f59e0b',
  },

  flowIconError: {
    width: isMobile() ? '36px' : '44px',
    height: isMobile() ? '36px' : '44px',
    borderRadius: '50%',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #dc2626',
  },

  flowIconPending: {
    width: isMobile() ? '36px' : '44px',
    height: isMobile() ? '36px' : '44px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #e5e7eb',
  },

  flowLabel: {
    fontSize: isMobile() ? '11px' : '13px',
    color: '#6b7280',
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  },

  flowLabelCurrent: {
    fontSize: isMobile() ? '11px' : '13px',
    color: '#1f2937',
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },

  flowLabelError: {
    fontSize: isMobile() ? '11px' : '13px',
    color: '#dc2626',
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },

  flowLineCompleted: {
    flex: 1,
    height: '2px',
    backgroundColor: '#16a34a',
    margin: isMobile() ? '0 4px' : '0 8px',
    marginBottom: isMobile() ? '24px' : '28px',
  },

  flowLinePending: {
    flex: 1,
    height: '2px',
    backgroundColor: '#e5e7eb',
    margin: isMobile() ? '0 4px' : '0 8px',
    marginBottom: isMobile() ? '24px' : '28px',
  },

  // Cards
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

  cardDisabled: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '20px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: isMobile() ? '16px' : '20px',
    cursor: 'not-allowed',
    transition: 'all 0.2s',
    marginBottom: '24px',
    boxSizing: 'border-box' as const,
    opacity: 0.6,
    pointerEvents: 'none' as const,
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

  // Info Card (mantido para compatibilidade)
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
};