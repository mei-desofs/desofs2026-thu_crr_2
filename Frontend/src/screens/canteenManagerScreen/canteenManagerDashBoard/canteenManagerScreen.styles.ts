const isMobile = () => window.innerWidth < 640;

export const canteenManagerStyles = {
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
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  logoCircle: {
    width: isMobile() ? '36px' : '40px',
    height: isMobile() ? '36px' : '40px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
    color: '#cefebfff',
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
    maxWidth: '800px',
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
};