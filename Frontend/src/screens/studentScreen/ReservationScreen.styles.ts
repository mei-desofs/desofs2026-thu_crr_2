const isMobile = () => window.innerWidth < 768;

export const reservationStyles = {
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
    maxWidth: "600px",
    margin: "0 auto",
    padding: isMobile() ? "24px 16px" : "32px 24px",
    boxSizing: "border-box" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "14px",
    padding: isMobile() ? "20px" : "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #f3f4f6",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#111827",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    color: "#374151",
  },

  valueStrong: {
    fontWeight: 700,
    color: "#111827",
  },

  confirmButton: {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },

  notice: {
    fontSize: "13px",
    color: "#4b5563",
    lineHeight: 1.5,
    margin: 0,
  },
};


