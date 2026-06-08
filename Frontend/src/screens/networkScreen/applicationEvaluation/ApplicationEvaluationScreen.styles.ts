const isMobile = () => window.innerWidth < 640;

export const applicationsStyles = {
  // Page Container
  pageContainer: {
    minHeight: '100vh',
    height: 'auto',
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
    padding: isMobile() ? '20px 16px' : '32px 24px',
    boxSizing: 'border-box' as const,
    overflow: 'auto',
  },

  // Page Header
  pageHeader: {
    marginBottom: isMobile() ? '24px' : '32px',
  },

  pageTitle: {
    fontSize: isMobile() ? '22px' : '28px',
    fontWeight: '700' as const,
    color: '#1f2937',
    margin: '0 0 8px 0',
  },

  pageDescription: {
    fontSize: isMobile() ? '14px' : '16px',
    color: '#6b7280',
    margin: 0,
  },

  // Tabs
  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '0',
  },

  tab: {
    background: 'none',
    border: 'none',
    padding: isMobile() ? '10px 16px' : '12px 24px',
    fontSize: isMobile() ? '14px' : '15px',
    fontWeight: '500' as const,
    color: '#6b7280',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  tabActive: {
    color: '#16a34a',
    borderBottomColor: '#16a34a',
    fontWeight: '600' as const,
  },

  // Search
  searchContainer: {
    position: 'relative' as const,
    marginBottom: '24px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },

  searchIcon: {
  position: 'absolute' as const,
  left: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none' as const,
},

  searchInput: {
  flex: 1,
  padding: isMobile() ? '10px 14px 10px 44px' : '12px 16px 12px 46px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: isMobile() ? '14px' : '15px',
  backgroundColor: 'white',
  outline: 'none',
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.2s',
  color: '#374151',
} as React.CSSProperties,

  // Applications (candidaturas) List
  applicationsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  applicationCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '16px' : '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    boxSizing: 'border-box' as const,
  },

  orderButton: {
  padding: isMobile() ? '10px 14px' : '12px 16px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  backgroundColor: 'white',
  color: '#374151',
  fontSize: isMobile() ? '13px' : '14px',
  fontWeight: '500' as const,
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap' as const,
  minWidth: isMobile() ? 'auto' : '180px',
} as React.CSSProperties,

  applicationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '12px',
  },

  applicationNome: {
    fontSize: isMobile() ? '16px' : '18px',
    fontWeight: '600' as const,
    color: '#1f2937',
    margin: 0,
    flex: 1,
  },

  statusBadgeAceite: {
    padding: '4px 12px',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    fontSize: '11px',
    fontWeight: '600' as const,
    borderRadius: '12px',
    letterSpacing: '0.5px',
  },

  statusBadgeRecusada: {
    padding: '4px 12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    fontSize: '11px',
    fontWeight: '600' as const,
    borderRadius: '12px',
    letterSpacing: '0.5px',
  },

  applicationInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '16px',
  },

  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  infoText: {
    fontSize: isMobile() ? '13px' : '14px',
    color: '#6b7280',
  },

  comentarioBox: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
    borderLeft: '3px solid #d1d5db',
  },

  comentarioLabel: {
    fontSize: '13px',
    color: '#374151',
    display: 'block',
    marginBottom: '6px',
  },

  comentarioText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 8px 0',
    lineHeight: '1.5',
  },

  dataAvaliacao: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
    fontStyle: 'italic' as const,
  },

  actionButtons: {
    display: 'flex',
    gap: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb',
    flexDirection: isMobile() ? 'column' as const : 'row' as const,
  },

  recusarButton: {
    flex: 1,
    padding: isMobile() ? '10px 16px' : '10px 20px',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#dc2626',
    fontSize: isMobile() ? '13px' : '14px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  } as React.CSSProperties,

  aceitarButton: {
    flex: 1,
    padding: isMobile() ? '10px 16px' : '10px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#16a34a',
    color: 'white',
    fontSize: isMobile() ? '13px' : '14px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)',
  } as React.CSSProperties,

  // Empty State
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile() ? '40px 20px' : '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
  },

  emptyStateText: {
    fontSize: isMobile() ? '14px' : '16px',
    color: '#9ca3af',
    marginTop: '12px',
  },

  // Modal
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 1000,
  },

  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile() ? '24px' : '32px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    boxSizing: 'border-box' as const,
  },

  modalTitle: {
    fontSize: isMobile() ? '18px' : '20px',
    fontWeight: '700' as const,
    color: '#1f2937',
    margin: '0 0 8px 0',
  },

  modalSubtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: '0 0 24px 0',
  },

  modalFormGroup: {
    marginBottom: '24px',
  },

  modalLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#374151',
    marginBottom: '8px',
  },

  required: {
    color: '#ef4444',
  },

  modalTextarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    outline: 'none',
    boxSizing: 'border-box' as const,
    minHeight: '100px',
    backgroundColor: 'transparent',
    color: '#374151',
  } as React.CSSProperties,

  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    flexDirection: isMobile() ? 'column-reverse' as const : 'row' as const,
  },

  modalCancelButton: {
    padding: '10px 20px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: isMobile() ? '100%' : 'auto',
  } as React.CSSProperties,

  modalConfirmButtonAceitar: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#16a34a',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)',
    width: isMobile() ? '100%' : 'auto',
  } as React.CSSProperties,

  modalConfirmButtonRecusar: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#dc2626',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
    width: isMobile() ? '100%' : 'auto',
  } as React.CSSProperties,
};