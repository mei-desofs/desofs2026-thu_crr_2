const isMobile = () => window.innerWidth < 640;

export const ApplicationStyles = {
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
    maxWidth: '900px',
    margin: '0 auto',
    padding: isMobile() ? '16px' : '32px 24px',
    boxSizing: 'border-box' as const,
    overflow: 'auto',
  },

  pageHeader: {
    marginBottom: isMobile() ? '20px' : '32px',
  },

  pageTitle: {
    fontSize: isMobile() ? '20px' : '30px',
    fontWeight: '700' as const,
    color: '#1f2937',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },

  pageDescription: {
    color: '#6b7280',
    fontSize: isMobile() ? '14px' : '16px',
    margin: 0,
  },

  // Form Container
  formContainer: {
    backgroundColor: 'white',
    borderRadius: isMobile() ? '12px' : '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: isMobile() ? '20px' : '32px',
    boxSizing: 'border-box' as const,
  },

  formSection: {
    marginBottom: isMobile() ? '24px' : '32px',
  },

  sectionTitle: {
    fontSize: isMobile() ? '16px' : '20px',
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: isMobile() ? '16px' : '24px',
    margin: `0 0 ${isMobile() ? '16px' : '24px'} 0`,
  },

  sectionDescription: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },

  // Form Elements
  formGroup: {
    marginBottom: isMobile() ? '16px' : '24px',
  },

  formLabel: {
    display: 'block',
    color: '#374151',
    marginBottom: '8px',
    fontWeight: '500' as const,
    fontSize: '14px',
  },

  required: {
    color: '#ef4444',
  },

  formInput: {
    width: '100%',
    padding: isMobile() ? '10px 14px' : '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: isMobile() ? '14px' : '16px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box' as const,
    backgroundColor: '#f9fafb',
    color: '#1f2937',
  } as React.CSSProperties,

  inputError: {
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
  },

  errorMessage: {
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '6px',
    margin: '6px 0 0 0',
  },

  // Upload Area
  uploadArea: {
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    padding: isMobile() ? '24px 16px' : '48px 32px',
    textAlign: 'center' as const,
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s',
    boxSizing: 'border-box' as const,
    marginBottom: isMobile() ? '16px' : '24px',
  },

  uploadError: {
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
  },

  fileInput: {
    display: 'none',
  },

  uploadLabel: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },

  uploadIcon: {
    color: '#9ca3af',
    marginBottom: '12px',
  },

  uploadText: {
    color: '#6b7280',
    marginBottom: '4px',
    fontSize: isMobile() ? '13px' : '15px',
    margin: '0 0 4px 0',
  },

  filesList: {
    marginTop: '16px',
    textAlign: 'left' as const,
    width: '100%',
  },

  filesTitle: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },

  fileItem: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '4px',
    margin: '0 0 4px 0',
  },

  // Form Actions
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: isMobile() ? '12px' : '16px',
    paddingTop: isMobile() ? '16px' : '20px',
    borderTop: '1px solid #e5e7eb',
    flexDirection: isMobile() ? 'column-reverse' as const : 'row' as const,
  },

  weeksList: {
    maxHeight: '500px',
    overflowY: 'auto' as const,
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '8px',
  /* Estilos da scrollbar */
    scrollbarWidth: 'thin', // Firefox
    scrollbarColor: '#d1d5db #f9fafb', // Firefox
    // Chrome, Edge, Safari
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f9fafb',
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#d1d5db',
      borderRadius: '8px',
    },
  },


  weekCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '12px',
    overflow: 'hidden',
  },

  weekHeader: {
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    borderBottom: '1px solid #e5e7eb',
  },

  weekTitle: {
    fontWeight: '600' as const,
    color: '#1f2937',
    fontSize: '14px',
  },

  weekDate: {
    fontSize: '12px',
    color: '#6b7280',
    marginLeft: '8px',
  },

  weekBadge: {
    marginLeft: '8px',
    fontSize: '12px',
    color: '#16a34a',
    fontWeight: '600' as const,
  },

  weekContent: {
    padding: '16px',
    backgroundColor: 'white',
  },

  productRow: {
    display: 'grid',
    gridTemplateColumns: isMobile() ? '1fr' : '2fr 1fr 1fr 40px',
    gap: '12px',
    marginBottom: '12px',
    alignItems: 'start',
  },

  productSelect: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f9fafb',
    boxSizing: 'border-box' as const,
    color : '#1f2937',
  } as React.CSSProperties,

  addButton: {
    padding: '8px 16px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '12px',
  } as React.CSSProperties,

  deleteButton: {
    padding: '8px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

  btnSecondary: {
    padding: isMobile() ? '10px 20px' : '12px 24px',
    borderRadius: '8px',
    fontSize: isMobile() ? '14px' : '16px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    width: isMobile() ? '100%' : 'auto',
  } as React.CSSProperties,

  btnPrimary: {
    padding: isMobile() ? '10px 20px' : '12px 24px',
    borderRadius: '8px',
    fontSize: isMobile() ? '14px' : '16px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    width: isMobile() ? '100%' : 'auto',
    boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)',
  } as React.CSSProperties,

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
    // --- ADICIONAR A PARTIR DAQUI ---

  productCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    backgroundColor: '#fafafa',
  },

  productCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },

  productCardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#1f2937'
  },

  productGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile() ? '1fr' : '2fr 1fr 1fr',
    gap: '12px',
    marginBottom: '16px'
  },

  weeksContainer: { },

  weeksToggle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '1px solid #e5e7eb',
  },

  weeksCollapsed: {
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginTop: '8px',
    border: '1px solid #e5e7eb'
  },

  weekSelectedBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    border: '1px solid #16a34a'
  },

  weeksExpandedContainer: {
    maxHeight: '250px',
    overflowY: 'auto',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '8px',
    backgroundColor: 'white'
  },

  weeksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '8px'
  },

  weekOption: (isSelected: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#dcfce7' : 'transparent',
    border: isSelected ? '1px solid #16a34a' : '1px solid transparent',
    transition: 'all 0.2s'
  }),

  weekOptionCheckbox: {
    marginRight: '8px',
    cursor: 'pointer'
  },

  weekOptionLabel: {
    fontSize: '13px',
    color: '#374151',
    lineHeight: 1.3
  },

  };