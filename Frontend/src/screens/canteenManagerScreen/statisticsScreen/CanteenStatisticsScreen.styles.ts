export const canteenStatisticsStyles = {
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
  } as React.CSSProperties,

  header: {
    backgroundColor: '#16a34a',
    color: 'white',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flexShrink: 0,
    width: '100%',
    boxSizing: 'border-box' as const,
    overflow: 'hidden',
  } as React.CSSProperties,

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  } as React.CSSProperties,

  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
    flex: 1,
  } as React.CSSProperties,

  headerTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
    color: 'white',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as React.CSSProperties,

  headerSubtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255,255,255,0.9)',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as React.CSSProperties,

  headerActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  } as React.CSSProperties,

  iconButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

  mainContent: {
    flex: 1,
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '48px 24px',
    boxSizing: 'border-box' as const,
    paddingBottom: '60px',
  } as React.CSSProperties,

  contentWrapper: {
    width: '100%',
  } as React.CSSProperties,

  titleSection: {
    marginBottom: '32px',
  } as React.CSSProperties,

  pageTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,

  pageDescription: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '8px 0 0 0',
    lineHeight: '1.5',
  } as React.CSSProperties,

  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  } as React.CSSProperties,

  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,

  statCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  } as React.CSSProperties,

  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#f0fdf4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

  statCardTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
  } as React.CSSProperties,

  statCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  } as React.CSSProperties,

  statValue: {
    fontSize: '36px',
    fontWeight: 700,
    color: '#16a34a',
    lineHeight: '1',
  } as React.CSSProperties,

  statDescription: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,

  loadingText: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,

  errorText: {
    fontSize: '16px',
    color: '#ef4444',
    margin: 0,
  } as React.CSSProperties,

  // Filters
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '24px',
    alignItems: 'flex-end',
  } as React.CSSProperties,

  filterGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    minWidth: '250px',
    flex: '1 1 auto',
  } as React.CSSProperties,

  filterLabel: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#374151',
  } as React.CSSProperties,

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
  } as React.CSSProperties,

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
  } as React.CSSProperties,

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
  } as React.CSSProperties,

  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  } as React.CSSProperties,

  calendarDayHeader: {
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#9ca3af',
    fontWeight: '600' as const,
    padding: '8px 0',
  } as React.CSSProperties,

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
  } as React.CSSProperties,

  calendarDaySelected: {
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: 600,
    borderRadius: '50%',
  } as React.CSSProperties,

  noDataContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    color: '#6b7280',
    fontSize: '16px',
  } as React.CSSProperties,

  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    color: '#6b7280',
    fontSize: '16px',
  } as React.CSSProperties,

  errorContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    color: '#ef4444',
    fontSize: '16px',
  } as React.CSSProperties,

  // Table
  tableContainer: {
    marginTop: '24px',
  } as React.CSSProperties,

  tableCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,

  tableTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#111827',
    margin: '0 0 20px 0',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,

  tableWrapper: {
    overflowX: 'auto',
  } as React.CSSProperties,

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  } as React.CSSProperties,

  tableHeader: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
  } as React.CSSProperties,

  tableRow: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,

  tableCell: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#111827',
  } as React.CSSProperties,

  selectFilter: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    backgroundColor: '#fff',
    color: '#111827',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,
};

