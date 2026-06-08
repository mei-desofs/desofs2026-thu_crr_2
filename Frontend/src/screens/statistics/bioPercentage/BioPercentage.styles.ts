const isMobile = () => window.innerWidth < 640;

export const bioPercentageStyles = {
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

  backButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

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
    color: '#bffec2ff',
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
  },

  // Title Section
  titleSection: {
    marginBottom: isMobile() ? '24px' : '32px',
  },

  pageTitle: {
    fontSize: isMobile() ? '24px' : '32px',
    fontWeight: '700' as const,
    color: '#1f2937',
    margin: '0 0 8px 0',
  },

  pageDescription: {
    fontSize: isMobile() ? '14px' : '16px',
    color: '#6b7280',
    margin: 0,
  },

  // Filters
  filtersContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexDirection: isMobile() ? 'column' as const : 'row' as const,
  },

  searchBox: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },

  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'transparent',
    color: '#374151',
  } as React.CSSProperties,

  filterBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    minWidth: isMobile() ? '100%' : '250px',
  },

  filterSelect: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#374151',
  } as React.CSSProperties,

  // Suppliers Grid
  suppliersGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile() ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '16px',
  },

  supplierCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '16px' : '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    minHeight: '110px',
  } as React.CSSProperties,

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },

  supplierName: {
    fontSize: isMobile() ? '18px' : '20px',
    fontWeight: '600' as const,
    color: '#1f2937',
    margin: 0,
  },

  statusBadge: {
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '12px',
    fontWeight: '500' as const,
    whiteSpace: 'nowrap' as const,
  },

  categoryTag: {
    fontSize: '13px',
    padding: '6px 12px',
    backgroundColor: '#e1f0d9ff',
    color: '#16a34a',
    borderRadius: '6px',
    fontWeight: '500' as const,
    alignSelf: 'flex-start',
  },

  supplierInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },

  infoText: {
    fontSize: isMobile() ? '13px' : '14px',
    color: '#6b7280',
  },

  dateText: {
    fontSize: isMobile() ? '12px' : '13px',
    color: '#9ca3af',
    marginTop: '4px',
  },

  // Empty State
  emptyState: {
    textAlign: 'center' as const,
    padding: '48px 24px',
  },

  emptyText: {
    fontSize: '16px',
    color: '#6b7280',
  },

  // Details View
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '20px' : '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },

  detailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    gap: '16px',
  },

  detailsTitle: {
    fontSize: isMobile() ? '24px' : '28px',
    fontWeight: '700' as const,
    color: '#1f2937',
    margin: '0 0 8px 0',
  },

  detailsSection: {
    marginBottom: '24px',
  },

  sectionTitle: {
    fontSize: isMobile() ? '16px' : '18px',
    fontWeight: '600' as const,
    color: '#1f2937',
    margin: '0 0 16px 0',
  },

  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile() ? '1fr' : '1fr 1fr',
    gap: '16px',
  },

  detailItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },

  detailLabel: {
    fontSize: '13px',
    fontWeight: '500' as const,
    color: '#6b7280',
  },

  detailValue: {
    fontSize: isMobile() ? '14px' : '15px',
    color: '#1f2937',
  },

  certificationsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },

  certificationBadge: {
    fontSize: '13px',
    padding: '6px 12px',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    borderRadius: '6px',
    fontWeight: '500' as const,
  },

  cardMeta: {
  marginTop: '8px',
  },

  ingredientsText: {
    fontSize: isMobile() ? '14px' : '15px',
    color: '#374151',
    fontWeight: '500' as const,
  },

};