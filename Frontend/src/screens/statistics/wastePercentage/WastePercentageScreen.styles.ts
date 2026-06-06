const isMobile = () => window.innerWidth < 640;

export const wastePercentageStyles = {
  // Page Container
  pageContainer: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    margin: 0,
    padding: 0,
    boxSizing: 'border-box' as const,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,

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
    paddingBottom: '60px',
  },

  contentWrapper: {
    width: '100%',
  },

  titleSection: {
    marginBottom: isMobile() ? '24px' : '32px',
  },

  pageTitle: {
    fontSize: isMobile() ? '24px' : '32px',
    fontWeight: '700' as const,
    color: '#1f2937',
    margin: '0 0 12px 0',
    display: 'flex',
    alignItems: 'center',
  },

  pageDescription: {
    fontSize: isMobile() ? '14px' : '16px',
    color: '#6b7280',
    lineHeight: '1.6',
    margin: 0,
  },

  // Filters
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '20px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
    alignItems: 'flex-end',
  },

  filterGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    minWidth: isMobile() ? '100%' : '200px',
    flex: isMobile() ? '1 1 100%' : '0 1 auto',
  },

  filterLabel: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#374151',
  },

  filterWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    padding: '6px 10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
    position: 'relative' as const,
  } as React.CSSProperties,

  dateButtonText: {
    fontSize: '14px',
    flex: 1,
  },

  clearDateButton: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0 4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  } as React.CSSProperties,

  // Calendar
  calendarContainer: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: '8px',
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    minWidth: '280px',
  } as React.CSSProperties,

  calendarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },

  calendarNavButton: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,

  calendarMonthYear: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },

  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },

  calendarDayHeader: {
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#9ca3af',
    fontWeight: '600' as const,
    padding: '8px 0',
  },

  calendarDay: {
    textAlign: 'center' as const,
    fontSize: '14px',
    color: 'white',
    padding: '0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: '36px',
    width: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2px auto',
  } as React.CSSProperties,

  calendarDayOtherMonth: {
    color: '#6b7280',
  },

  calendarDaySelected: {
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: 600,
    borderRadius: '50%',
  },

  // Total Waste Card
  totalWasteCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '24px' : '32px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    marginBottom: '24px',
    border: '3px solid #16a34a',
  },

  totalWasteCardHeader: {
    textAlign: 'center' as const,
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e5e7eb',
  },

  totalWasteCardTitle: {
    fontSize: isMobile() ? '20px' : '24px',
    fontWeight: '700' as const,
    color: '#1f2937',
    margin: '0 0 8px 0',
  },

  totalWasteCardSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },

  totalWastePercentage: {
    textAlign: 'center' as const,
    marginBottom: '24px',
  },

  totalWastePercentageValue: {
    fontSize: isMobile() ? '56px' : '72px',
    fontWeight: '700' as const,
    color: '#16a34a',
    display: 'block',
    marginBottom: '8px',
  },

  totalWastePercentageDescription: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },

  calculationDetails: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    border: '1px solid #e5e7eb',
  },

  calculationTitle: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#374151',
    margin: '0 0 8px 0',
  },

  calculationFormula: {
    fontSize: '14px',
    color: '#1f2937',
    fontFamily: 'monospace',
    wordBreak: 'break-word' as const,
  },

  totalWasteBreakdown: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: '20px',
    borderTop: '2px solid #e5e7eb',
  },

  totalWasteBreakdownItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
  },

  totalWasteBreakdownLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500' as const,
  },

  totalWasteBreakdownValue: {
    fontSize: '20px',
    fontWeight: '700' as const,
    color: '#1f2937',
  },

  // Waste Cards Container
  wasteCardsContainer: {
    display: 'grid',
    gridTemplateColumns: isMobile() ? '1fr' : 'repeat(2, 1fr)',
    gap: '24px',
    marginTop: '24px',
  },

  wasteCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '20px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },

  wasteCardHeader: {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e5e7eb',
  },

  wasteCardTitle: {
    fontSize: isMobile() ? '18px' : '20px',
    fontWeight: '700' as const,
    color: '#1f2937',
    margin: '0 0 8px 0',
  },

  wasteCardSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },

  wasteCardContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  wasteStat: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },

  wasteStatLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500' as const,
  },

  wasteStatValue: {
    fontSize: '18px',
    fontWeight: '700' as const,
    color: '#1f2937',
  },

  wastePercentage: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#dcfce7',
    borderRadius: '8px',
    border: '2px solid #16a34a',
  },

  wastePercentageLabel: {
    fontSize: '16px',
    color: '#166534',
    fontWeight: '600' as const,
  },

  wastePercentageValue: {
    fontSize: isMobile() ? '32px' : '40px',
    fontWeight: '700' as const,
    color: '#16a34a',
  },

  wasteMealsList: {
    marginTop: '8px',
  },

  wasteMealsListTitle: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#374151',
    margin: '0 0 12px 0',
  },

  wasteMealItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    marginBottom: '8px',
  },

  wasteMealName: {
    fontSize: '14px',
    color: '#1f2937',
    fontWeight: '500' as const,
  },

  wasteMealPercentage: {
    fontSize: '16px',
    fontWeight: '700' as const,
    color: '#16a34a',
  },

  noDataInCard: {
    padding: '24px',
    textAlign: 'center' as const,
    color: '#6b7280',
  },

  // Loading, Error, No Data
  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    color: '#6b7280',
  },

  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    color: '#dc2626',
  },

  noDataContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    color: '#6b7280',
  },
};

