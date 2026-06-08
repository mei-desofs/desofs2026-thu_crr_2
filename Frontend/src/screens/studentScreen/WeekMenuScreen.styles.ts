const isMobile = () => window.innerWidth < 768;

export const weekMenuStyles = {
  pageContainer: {
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#f9fafb",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: "flex",
    flexDirection: "column" as const,
  },

  header: {
    backgroundColor: "#16a34a",
    color: "white",
    padding: isMobile() ? "12px 16px" : "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    flexShrink: 0,
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  backButton: {
    background: "none",
    border: "none",
    color: "white",
    padding: isMobile() ? "6px" : "8px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,

  headerText: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  },

  headerTitle: {
    margin: 0,
    fontSize: isMobile() ? "18px" : "22px",
    fontWeight: 700,
  },

  headerSubtitle: {
    margin: 0,
    fontSize: isMobile() ? "13px" : "14px",
    color: "#bbf7d0",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: isMobile() ? "8px" : "16px",
  },

  iconButton: {
    background: "none",
    border: "none",
    color: "white",
    padding: isMobile() ? "6px" : "8px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,

  mainContent: {
    flex: 1,
    width: "100%",
    maxWidth: "98%",
    margin: "0 auto",
    padding: isMobile() ? "24px 16px" : "48px 40px",
    boxSizing: "border-box" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },

  toolbar: {
    display: "flex",
    flexDirection: isMobile() ? "column" as const : "row" as const,
    justifyContent: "space-between",
    gap: "12px",
  },

  dateInfo: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "10px",
  },

  dateItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "white",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    fontSize: "14px",
    color: "#111827",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap" as const,
  },

  filterWrapper: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "6px 10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },

  select: {
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#fff",
    cursor: "pointer",
    borderRadius: "8px",
    padding: "6px 10px",
    color: "#111827",
    minHeight: "32px",
  } as React.CSSProperties,

  refreshButton: {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 600,
    fontSize: "14px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
  },

  errorBox: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecdd3",
    borderRadius: "12px",
    padding: "12px 14px",
  },

  placeholderBox: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "18px",
    textAlign: "center" as const,
    color: "#4b5563",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
  },

  daysGrid: {
    display: "grid",
    gridTemplateColumns: isMobile() ? "1fr" : "repeat(5, minmax(140px, 1fr))",
    gap: "10px",
    alignItems: "start",
    gridAutoRows: "auto",
    justifyItems: "stretch",
    overflowX: isMobile() ? "auto" : "hidden",
    width: "100%",
    boxSizing: "border-box" as const,
  },

  dayCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "10px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    height: "100%",
    minHeight: "200px",
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
    width: "100%",
    margin: "0",
    boxSizing: "border-box" as const,
  },

  dayHeader: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    paddingBottom: "6px",
    borderBottom: "1px solid #f3f4f6",
    marginBottom: "4px",
  },

  dayTitle: {
    margin: 0,
    fontSize: "11px",
    fontWeight: 700,
    color: "#111827",
    lineHeight: "1.3",
    letterSpacing: "-0.01em",
  },

  mealList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },

  mealItem: {
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "8px",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
    position: 'relative' as const,
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },

  mealHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "6px",
    flexWrap: "wrap" as const,
    marginBottom: "2px",
  },

  mealName: {
    margin: 0,
    fontSize: "10px",
    fontWeight: 600,
    color: "#111827",
    lineHeight: "1.3",
    flex: "1",
    minWidth: "80px",
  },

  mealTag: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "2px 6px",
    borderRadius: "3px",
    fontSize: "8px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.2px",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
  },

  mealDescription: {
    margin: 0,
    fontSize: "9px",
    color: "#6b7280",
    lineHeight: "1.3",
    marginTop: "1px",
    marginBottom: "1px",
  },

  mealEmpty: {
    border: "1px dashed #cbd5e1",
    borderRadius: "10px",
    padding: "12px",
    textAlign: "center" as const,
    color: "#6b7280",
    backgroundColor: "#f8fafc",
  },

  mealActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "4px",
    flexWrap: "nowrap" as const,
    marginTop: "3px",
    position: "relative" as const,
    paddingTop: "6px",
    borderTop: "1px solid #f3f4f6",
  },

  reserveButton: {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "4px 8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "9px",
    boxShadow: "0 1px 2px rgba(22, 163, 74, 0.2)",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap" as const,
  } as React.CSSProperties,

  quantityWrapper: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    gap: "6px",
    flex: "1",
  },

  quantityLabel: {
    fontSize: "11px",
    color: "#6b7280",
    fontWeight: 500,
    whiteSpace: "nowrap" as const,
  },

  quantityInput: {
    width: "40px",
    padding: "3px 4px",
    borderRadius: "4px",
    border: "1px solid #d1d5db",
    fontSize: "9px",
    outline: "none",
    textAlign: "center" as const,
    backgroundColor: "#ffffff",
    color: "#111827",
  } as React.CSSProperties,

  infoButton: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#374151",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "9px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
    flexShrink: 0,
  } as React.CSSProperties,
};


