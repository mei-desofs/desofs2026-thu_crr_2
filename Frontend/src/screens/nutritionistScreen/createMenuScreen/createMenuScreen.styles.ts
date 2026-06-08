const isMobile = () => window.innerWidth < 768;

export const createMenuStyles = {
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
    padding: isMobile() ? '12px 16px' : '20px 32px',
    display: 'flex',
    alignItems: 'center',
    gap: isMobile() ? '12px' : '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    flexShrink: 0,
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

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: isMobile() ? '16px' : '20px',
    fontWeight: '700' as const,
    margin: '0 0 4px 0',
  },

  headerSubtitle: {
    fontSize: isMobile() ? '11px' : '14px',
    color: '#bbf7d0',
    margin: 0,
  },

  // Main Content
  mainContent: {
    flex: 1,
    width: '100%',
    padding: isMobile() ? '12px' : '32px',
    boxSizing: 'border-box' as const,
    overflow: 'auto',
  },

  contentWrapper: {
    display: 'flex',
    gap: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    flexDirection: isMobile() ? 'column' as const : 'row' as const,
  },

  // Left Section
  leftSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: isMobile() ? '16px' : '20px',
  },

  formCard: {
    backgroundColor: 'white',
    borderRadius: isMobile() ? '8px' : '12px',
    padding: isMobile() ? '16px' : '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box' as const,
  },

  sectionTitle: {
    fontSize: isMobile() ? '16px' : '18px',
    fontWeight: '600' as const,
    color: '#1f2937',
    margin: '0 0 16px 0',
  },

  sectionDescription: {
    fontSize: isMobile() ? '12px' : '14px',
    color: '#6b7280',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
  },

  // Form Elements
  formGroup: {
    marginBottom: isMobile() ? '16px' : '20px',
  },

  label: {
    display: 'block',
    fontSize: isMobile() ? '13px' : '14px',
    fontWeight: '500' as const,
    color: '#374151',
    marginBottom: '8px',
  },

  dateInputWrapper: {
    position: 'relative' as const,
    color: '#374151',
  },

  dateInput: {
    width: '100%',
    padding: isMobile() ? '10px 40px 10px 10px' : '12px 40px 12px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: isMobile() ? '13px' : '14px',
    backgroundColor: 'white',
    outline: 'none',
    boxSizing: 'border-box' as const,
    color: '#374151',
  } as React.CSSProperties,

  calendarIcon: {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
  },

  select: {
    width: '100%',
    padding: isMobile() ? '10px' : '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: isMobile() ? '13px' : '14px',
    backgroundColor: 'white',
    outline: 'none',
    cursor: 'pointer',
    color: '#374151',
    boxSizing: 'border-box' as const,
    overflowY: 'auto',
  } as React.CSSProperties,

  // Days Grid - Responsive: Always 1 col mobile, 3 cols desktop
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile() ? '1fr' : 'repeat(3, 1fr)',
    gap: isMobile() ? '12px' : '16px',
    gridAutoFlow: 'row' as const,
  },

  dayCard: {
    border: '1px solid #e5e7eb',
    borderRadius: isMobile() ? '6px' : '8px',
    padding: isMobile() ? '12px' : '16px',
    backgroundColor: '#fafafa',
  },

  dayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isMobile() ? '12px' : '16px',
    paddingBottom: isMobile() ? '10px' : '12px',
    borderBottom: '2px solid #e5e7eb',
  },

  dayName: {
    fontSize: isMobile() ? '13px' : '14px',
    fontWeight: '600' as const,
    color: '#1f2937',
    margin: 0,
  },

  dayDate: {
    fontSize: isMobile() ? '12px' : '13px',
    color: '#6b7280',
  },

  // Meal Type Section
  mealTypeSection: {
    marginBottom: isMobile() ? '12px' : '16px',
  },

  mealTypeLabel: {
    display: 'block',
    fontSize: isMobile() ? '10px' : '11px',
    fontWeight: '600' as const,
    color: '#6b7280',
    marginBottom: isMobile() ? '6px' : '8px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
  },

  // Dropdown Wrapper - Flex para botão e refresh
  dropdownWrapper: {
    display: 'flex',
    gap: isMobile() ? '6px' : '8px',
    alignItems: 'flex-start',
    marginBottom: isMobile() ? '6px' : '8px',
  },

  dropdown: {
    position: 'relative' as const,
    color: '#374151',
    flex: 1,
  },

  dropdownButton: {
    width: '100%',
    padding: isMobile() ? '8px 10px' : '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: isMobile() ? '12px' : '13px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s',
    wordBreak: 'break-word' as const,
  } as React.CSSProperties,

  dropdownButtonSelected: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
    color: '#166534',
  },

  dropdownMenu: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    marginTop: '4px',
    maxHeight: isMobile() ? '180px' : '240px',
    overflowY: 'auto' as const,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    color: '#374151',
  },

  dropdownItem: {
    padding: isMobile() ? '8px 10px' : '10px 12px',
    cursor: 'pointer',
    fontSize: isMobile() ? '12px' : '13px',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.15s',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    wordBreak: 'break-word' as const,
  } as React.CSSProperties,

  scoreChip: {
    display: 'inline-block',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: isMobile() ? '10px' : '11px',
    fontWeight: '600' as const,
    marginLeft: '8px',
    flexShrink: 0,
    whiteSpace: 'nowrap' as const,
  },

  // Selected Dish Info
  selectedDishInfo: {
    marginTop: isMobile() ? '6px' : '8px',
    padding: isMobile() ? '8px' : '10px', 
    backgroundColor: '#ffffffff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },

  ingredientsTitle: {
    fontSize: '10px',
    fontWeight: '600' as const,
    color: '#3f3f3fff',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    marginBottom: '6px',
  },

  ingredientsList: {
    fontSize: isMobile() ? '10px' : '11px',
    color: '#696969ff',
    lineHeight: '1.6',
    margin: 0,
    backgroundColor: 'transparent',
  },

  // Action Buttons
  actionButtons: {
    display: 'flex',
    gap: isMobile() ? '10px' : '12px',
    justifyContent: 'flex-end',
    flexDirection: isMobile() ? 'column' as const : 'row' as const,
    paddingTop: isMobile() ? '8px' : '0',
  },

  cancelButton: {
    padding: isMobile() ? '10px 20px' : '12px 24px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: isMobile() ? '13px' : '14px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: isMobile() ? '100%' : 'auto',
  } as React.CSSProperties,

  createButton: {
    padding: isMobile() ? '10px 20px' : '12px 24px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#16a34a',
    color: 'white',
    fontSize: isMobile() ? '13px' : '14px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)',
    width: isMobile() ? '100%' : 'auto',
  } as React.CSSProperties,

   mealPeriodDivider: {
    borderTop: '2px solid #e5e7eb',
    marginTop: isMobile() ? '16px' : '20px',
    marginBottom: isMobile() ? '12px' : '16px',
    paddingTop: isMobile() ? '12px' : '16px',
  },

   popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  popupContent: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    color: '#1f2937',
  },
};