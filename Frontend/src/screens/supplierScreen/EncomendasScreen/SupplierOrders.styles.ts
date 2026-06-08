const isMobile = () => window.innerWidth < 640;

export const supplierOrdersStyles = {
  isMobile,
  
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
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  logoCircle: () => ({
    backgroundColor: '#fff',
    borderRadius: '50%',
    width: isMobile() ? '30px' : '45px',
    height: isMobile() ? '30px' : '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  logoText: {
    color: '#16a34a',
    fontWeight: '700' as const,
    fontSize: isMobile() ? '14px' : '18px',
  },

  headerInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
  },

  headerTitle: {
    fontWeight: '700' as const,
    fontSize: isMobile() ? '14px' : '18px',
    margin: 0,
  },

  headerSubtitle: {
    fontSize: isMobile() ? '12px' : '14px',
    color: '#bbf7d0',
    margin: 0,
  },

  headerActions: {
    display: 'flex',
    gap: '8px',
  },

  iconButton: {
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

  // Main Content
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile() ? '24px 16px' : '48px 24px',
    width: '100%',
    boxSizing: 'border-box' as const,
  },

  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: isMobile() ? 'flex-start' : 'center',
    marginBottom: '32px',
    flexDirection: isMobile() ? 'column' as const : 'row' as const,
    gap: isMobile() ? '16px' : '0',
  },

  pageTitle: {
    fontSize: isMobile() ? '24px' : '32px',
    fontWeight: '700' as const,
    color: '#1f2937',
    margin: '0 0 8px 0',
  },

  pageSubtitle: {
    fontSize: isMobile() ? '14px' : '16px',
    color: '#6b7280',
    margin: 0,
  },

  // Filter
  filterContainer: {
    position: 'relative' as const,
  },

  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#1f2937',
  } as React.CSSProperties,

  filterDropdown: {
    position: 'absolute' as const,
    top: '48px',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    zIndex: 10,
    minWidth: '200px',
  },

  filterOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    color: '#1f2937',
    textAlign: 'left' as const,
  } as React.CSSProperties,

  filterOptionActive: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    fontWeight: '500' as const,
  },

  // Warning Card
  warningCard: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: '12px',
    marginBottom: '24px',
  },

  warningTitle: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#92400e',
    margin: '0 0 4px 0',
  },

  warningText: {
    fontSize: '13px',
    color: '#78350f',
    margin: 0,
    lineHeight: '1.5',
  },

  // Sections
  section: {
    marginBottom: '32px',
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },

  // Group Card
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },

  groupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f3f4f6',
  },

  groupTitle: {
    fontSize: '16px',
    fontWeight: '600' as const,
    color: '#1f2937',
    margin: 0,
  },

  groupBadge: {
    fontSize: '12px',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '4px 12px',
    borderRadius: '12px',
    fontWeight: '500' as const,
  },

  // Order Card
  orderCard: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '12px',
  },

  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },

  orderProduct: {
    fontSize: '15px',
    fontWeight: '600' as const,
    color: '#1f2937',
    margin: '0 0 4px 0',
  },

  orderDetails: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
  },

  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '500' as const,
    padding: '4px 10px',
    borderRadius: '12px',
  },

  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },

  statusConfirmed: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },

  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderDate: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
  },

  rejectButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,

  // Loading & Empty States
  loadingContainer: {
    textAlign: 'center' as const,
    padding: '48px',
    color: '#6b7280',
  },

  emptyState: {
    textAlign: 'center' as const,
    padding: '64px 24px',
  },

  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600' as const,
    color: '#1f2937',
    margin: '16px 0 8px 0',
  },

  emptyText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },

  // Modal
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },

  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 25px rgba(0,0,0,0.15)',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
  },

  modalTitle: {
    fontSize: '18px',
    fontWeight: '600' as const,
    color: '#1f2937',
    margin: 0,
  },

  modalCloseButton: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,

  modalBody: {
    padding: '20px',
  },

  modalText: {
    fontSize: '14px',
    color: '#1f2937',
    margin: '0 0 8px 0',
    lineHeight: '1.5',
  },

  modalSubtext: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
  },

  modalFooter: {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    borderTop: '1px solid #e5e7eb',
  },

  cancelButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    color: '#1f2937',
  } as React.CSSProperties,

  confirmRejectButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    color: '#fff',
  } as React.CSSProperties,

  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },

  tabButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
    color: '#1f2937',
    borderColor: '#1f2937',
  },

  tabButtonActive: {
    backgroundColor: '#2563eb',
    color: '#fff',
    borderColor: '#2563eb',
  },
};