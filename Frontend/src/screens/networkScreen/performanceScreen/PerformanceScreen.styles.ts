const isMobile = () => window.innerWidth < 640;

export const performanceStyles = {
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
    maxWidth: '1600px',
    margin: '0 auto',
    padding: isMobile() ? '24px 16px' : '48px 24px',
    boxSizing: 'border-box' as const,
    paddingBottom: '60px',
  },

  contentWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
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

  filterWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '6px 10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    cursor: 'pointer',
  } as React.CSSProperties,

  filterLabel: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
  },

  select: {
    padding: '10px 36px 10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    color: '#111827',
    cursor: 'pointer',
    minWidth: '200px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px',
    lineHeight: '1.5',
  } as React.CSSProperties,

  dateInput: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'white',
    cursor: 'pointer',
    minWidth: '200px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  } as React.CSSProperties,

  selectedFilterBadge: {
    marginTop: '8px',
    padding: '8px 12px',
    backgroundColor: '#dcfce7',
    border: '1px solid #16a34a',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  selectedFilterText: {
    fontSize: '13px',
    color: '#166534',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  dateButtonText: {
    fontSize: '14px',
    color: '#111827',
    cursor: 'pointer',
    minWidth: '140px',
    display: 'inline-block',
  } as React.CSSProperties,

  clearDateButton: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '20px',
    lineHeight: '1',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s, background-color 0.2s',
    borderRadius: '4px',
    width: '24px',
    height: '24px',
  } as React.CSSProperties,

  clearFiltersButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,

  // Calendar
  calendarContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '8px',
    backgroundColor: '#374151',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
    minWidth: '300px',
    border: '1px solid #4b5563',
  } as React.CSSProperties,

  calendarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    color: 'white',
  },

  calendarMonthYear: {
    fontSize: '16px',
    fontWeight: 600,
    textTransform: 'capitalize',
  },

  calendarNavButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,

  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
    width: '100%',
  },

  calendarDayHeader: {
    textAlign: 'center' as const,
    fontSize: '12px',
    fontWeight: 600,
    color: '#9ca3af',
    padding: '10px 4px',
    minHeight: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarDay: {
    textAlign: 'center',
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

  // Summary Cards
  summaryCards: {
    display: 'grid',
    gridTemplateColumns: isMobile() ? '1fr' : 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },

  summaryCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '20px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
  },

  percentageCard: {
    backgroundColor: '#dcfce7',
    border: '2px solid #16a34a',
  },

  cardTitle: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#6b7280',
    margin: '0 0 12px 0',
    textTransform: 'uppercase' as const,
  },

  cardValue: {
    fontSize: isMobile() ? '32px' : '40px',
    fontWeight: '700' as const,
    color: '#1f2937',
    margin: '0 0 8px 0',
  },

  cardSubtitle: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },

  percentageValue: {
    fontSize: isMobile() ? '40px' : '48px',
    fontWeight: '700' as const,
    color: '#16a34a',
    margin: '0 0 8px 0',
  },

  // Details
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '20px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },

  detailsTitle: {
    fontSize: '20px',
    fontWeight: '700' as const,
    color: '#1f2937',
    margin: '0 0 20px 0',
  },

  detailsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  detailItem: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '12px',
  },

  detailDate: {
    fontSize: '16px',
    fontWeight: '600' as const,
    color: '#1f2937',
  },

  detailStats: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    fontSize: '14px',
    color: '#6b7280',
  },

  detailPercentage: {
    fontWeight: '700' as const,
    color: '#16a34a',
    fontSize: '16px',
  },

  // Loading & Error
  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '48px',
    textAlign: 'center' as const,
    color: '#6b7280',
  },

  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center' as const,
    color: '#dc2626',
    border: '1px solid #fecaca',
  },

  noDataContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '48px',
    textAlign: 'center' as const,
    color: '#6b7280',
  },

  // Total Waste Card
  totalWasteCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '24px' : '32px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    marginBottom: '24px',
    border: '3px solid #16a34a',
    width: '100%',
    boxSizing: 'border-box' as const,
  },

  totalWasteCardHeader: {
    textAlign: 'center' as const,
    marginBottom: '32px',
    paddingBottom: '20px',
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
    marginBottom: '32px',
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
    paddingTop: '24px',
    borderTop: '2px solid #e5e7eb',
    gap: '24px',
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

  // Card and Chart Row (card e gráficos lado a lado)
  cardChartRow: {
    display: 'grid',
    gridTemplateColumns: isMobile() ? '1fr' : '1fr 1fr 1fr',
    gap: '24px',
    marginTop: '0',
    marginBottom: '24px',
    width: '100%',
    alignItems: 'stretch',
  },

  // Cards and Charts Container (lado a lado) - mantido para compatibilidade
  cardsAndChartsContainer: {
    display: 'grid',
    gridTemplateColumns: isMobile() ? '1fr' : '1fr 1fr',
    gap: '24px',
    marginTop: '24px',
    marginBottom: '24px',
  },

  cardsColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    justifyContent: 'flex-start',
  },

  chartsColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },

  comparisonChartContainer: {
    width: '100%',
    marginTop: '24px',
    marginBottom: '24px',
  },

  // Waste Card
  wasteCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '20px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    boxSizing: 'border-box' as const,
  },

  wasteCardLarge: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '24px' : '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    maxHeight: isMobile() ? '600px' : '700px',
    overflowY: 'auto' as const,
    height: '100%',
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

  noDataInCard: {
    padding: '24px',
    textAlign: 'center' as const,
    color: '#6b7280',
  },

  wasteMealsList: {
    marginTop: '8px',
    maxHeight: '300px',
    overflowY: 'auto' as const,
    paddingRight: '8px',
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

  // Chart Card
  chartCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '20px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    boxSizing: 'border-box' as const,
  },

  chartTitle: {
    fontSize: isMobile() ? '16px' : '18px',
    fontWeight: '700' as const,
    color: '#1f2937',
    margin: '0 0 16px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
  },

  chartContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
};

