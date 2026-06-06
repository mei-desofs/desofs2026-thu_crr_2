const isMobile = () => window.innerWidth < 640;

export const parishesStyles = {
  // Page Container
  pageContainer: {
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#f3f4f6",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: "flex",
    flexDirection: "column" as const,
    margin: 0,
    padding: 0,
    boxSizing: "border-box" as const,
    overflow: "auto",
  },

  // Header
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

  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  headerInfo: { display: "flex", flexDirection: "column" as const },
  headerTitle: { fontWeight: 700, fontSize: isMobile() ? 14 : 18, margin: 0, marginBottom: 2 },
  headerSubtitle: { fontSize: isMobile() ? 12 : 14, color: "#bffec2ff", margin: 0 },
  headerActions: { display: "flex", alignItems: "center", gap: isMobile() ? 8 : 16 },
  iconButton: { background: "none", border: "none", color: "white", padding: isMobile() ? 6 : 8, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } as React.CSSProperties,

  logoCircle: { width: isMobile() ? 36 : 40, height: isMobile() ? 36 : 40, backgroundColor: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  logoSize: isMobile() ? 18 : 20, // para Leaf size

  // Main
  mainContent: { flex: 1, width: "100%", maxWidth: 1200, margin: "0 auto", padding: isMobile() ? "24px 16px" : "48px 24px", boxSizing: "border-box", overflow: "auto" },

  pageTitle: { fontSize: isMobile() ? 24 : 32, fontWeight: 700, color: "#1f2937", margin: "0 0 8px 0" },

  // Filters
  filtersContainer: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, alignItems: "center" },
  searchContainer: { display: "flex", alignItems: "center", gap: 8, backgroundColor: "white", padding: "10px 16px", borderRadius: 8, border: "1px solid #e5e7eb", minWidth: 250, flex: "1 1 auto" },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: 16, fontFamily: "inherit", backgroundColor: "transparent", color: "#374151" } as React.CSSProperties,
  selectFilter: { background: "#f0fdf4", border: "1px solid #16a34a", color: "#166534", padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", minWidth: 200 },
  parishSelect: { background: "#f0fdf4", border: "1px solid #16a34a", color: "#166534", padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", minWidth: 200 },

  // Parish Cards
  applicationCard: { backgroundColor: "white", borderRadius: 12, padding: isMobile() ? 12 : 16, boxShadow: "0 1px 4px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" as const, gap: 8, position: "relative" } as React.CSSProperties,
  quarantineButton: { position: "absolute", top: 12, right: 12, padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" },
  applicationNome: { fontSize: isMobile() ? 16 : 18, fontWeight: 600, color: "#1f2937", margin: 0 },
  applicationHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 },
  quarantineBadge: { display: "flex", alignItems: "center", gap: 4, background: "#fee2e2", color: "#991b1b", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },

  applicationInfo: { display: "flex", alignItems: "center", gap: 4 },
  infoText: { fontSize: 12, color: "#6b7280" },

  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 },
  emptyStateText: { fontSize: 16, color: "#6b7280", marginTop: 12 },
};
