const isMobile = () => window.innerWidth < 768;

export const reservationsViewStyles = {
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
    maxWidth: "1200px",
    margin: "0 auto",
    padding: isMobile() ? "24px 16px" : "48px 24px",
    boxSizing: "border-box" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },

  toolbar: {
    display: "flex",
    flexDirection: isMobile() ? "column" as const : "row" as const,
    justifyContent: "space-between",
    gap: "12px",
  },

  searchWrapper: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "6px 10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    flex: isMobile() ? "1" : "0 1 auto",
  },

  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "transparent",
    color: "#111827",
    minWidth: "200px",
    flex: 1,
  } as React.CSSProperties,

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

  dateInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "transparent",
    color: "#111827",
    cursor: "pointer",
    minWidth: "140px",
  } as React.CSSProperties,

  clearDateButton: {
    background: "none",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
    fontSize: "20px",
    lineHeight: "1",
    padding: "0 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s",
  } as React.CSSProperties,

  dateButtonText: {
    fontSize: "14px",
    color: "#111827",
    cursor: "pointer",
    minWidth: "140px",
    display: "inline-block",
  } as React.CSSProperties,

  calendarContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: "8px",
    backgroundColor: "#374151",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    zIndex: 1000,
    minWidth: "300px",
    border: "1px solid #4b5563",
  } as React.CSSProperties,

  calendarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
    color: "white",
  },

  calendarMonthYear: {
    fontSize: "16px",
    fontWeight: 600,
    textTransform: "capitalize",
  },

  calendarNavButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  } as React.CSSProperties,

  calendarNavButtonHover: {
    backgroundColor: "#374151",
  },

  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "2px",
    width: "100%",
  },

  calendarDayHeader: {
    textAlign: "center" as const,
    fontSize: "12px",
    fontWeight: 600,
    color: "#9ca3af",
    padding: "10px 4px",
    minHeight: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  calendarDay: {
    textAlign: "center",
    fontSize: "14px",
    color: "white",
    padding: "0",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
    minHeight: "36px",
    width: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "2px auto",
  } as React.CSSProperties,

  calendarDayHover: {
    backgroundColor: "#374151",
  },

  calendarDayOtherMonth: {
    color: "#6b7280",
  },

  calendarDaySelected: {
    backgroundColor: "#3b82f6",
    color: "white",
    fontWeight: 600,
    borderRadius: "50%",
  },

  errorBox: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecdd3",
    borderRadius: "12px",
    padding: "12px 14px",
  },

  summaryContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },

  summaryBox: {
    backgroundColor: "#f0f9ff",
    color: "#0c4a6e",
    border: "2px solid #0ea5e9",
    borderRadius: "12px",
    padding: "16px 20px",
    fontSize: "18px",
    fontWeight: 700,
    textAlign: "center" as const,
    boxShadow: "0 2px 8px rgba(14, 165, 233, 0.15)",
  },

  summaryStats: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
  },

  statBox: {
    flex: 1,
    minWidth: "220px",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
  } as React.CSSProperties,

  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: 500,
    lineHeight: "1.4",
  },

  statValue: {
    fontSize: "28px",
    color: "#111827",
    fontWeight: 700,
    lineHeight: "1.2",
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

  reservationsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },

  reservationCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },

  reservationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },

  reservationInfo: {
    flex: 1,
  },

  reservationTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "8px",
  },

  reservationMeta: {
    marginTop: "0",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "16px",
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.6",
  },

  statusBadge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
  },

  statusActive: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },

  statusConsumed: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },

  statusNotConsumed: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },

  reservationFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
    gap: "12px",
  },

  quantityInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#374151",
  },

  quantityLabel: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: 500,
  },

  quantityValue: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#111827",
  },

  consumeButton: {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(22, 163, 74, 0.25)",
    transition: "all 0.2s",
    minWidth: "160px",
  } as React.CSSProperties,

  groupedCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    transition: "box-shadow 0.2s",
  } as React.CSSProperties,

  groupedHeader: {
    paddingBottom: "16px",
    borderBottom: "2px solid #e5e7eb",
    marginBottom: "4px",
  },

  groupedInfo: {
    flex: 1,
  },

  quantitySections: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },

  quantitySection: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },

  sectionTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#374151",
    letterSpacing: "0.01em",
  },

  sectionBadgeConsumed: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 700,
  },

  sectionBadgeActive: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 700,
  },

  activeReservationRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    transition: "background-color 0.2s, border-color 0.2s",
  } as React.CSSProperties,

  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },

  modalContent: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "24px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
  },

  modalDescription: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
  },

  modalInputWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },

  modalInput: {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "16px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,

  modalActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },

  modalCancelButton: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "background-color 0.2s",
  } as React.CSSProperties,

  modalConfirmButton: {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "background-color 0.2s",
  } as React.CSSProperties,

  wasteReportBanner: {
    backgroundColor: "#fef3c7",
    border: "2px solid #f59e0b",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  } as React.CSSProperties,

  wasteReportBannerText: {
    flex: 1,
    fontSize: "15px",
    fontWeight: 600,
    color: "#92400e",
  },

  wasteReportBannerButton: {
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "background-color 0.2s",
  } as React.CSSProperties,

  wasteReportModal: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "32px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  } as React.CSSProperties,

  wasteReportModalTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
    color: "#111827",
  },

  wasteReportModalInfo: {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.6",
  },

  wasteReportSliderContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },

  wasteReportSliderLabel: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#374151",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  wasteReportSliderValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#16a34a",
  },

  wasteReportSlider: {
    width: "100%",
    height: "8px",
    borderRadius: "4px",
    outline: "none",
    WebkitAppearance: "none" as const,
    appearance: "none" as const,
    backgroundColor: "#e5e7eb",
    cursor: "pointer",
  } as React.CSSProperties & {
    WebkitAppearance: "none";
    "&::-webkit-slider-thumb": {
      WebkitAppearance: "none";
      appearance: "none";
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "#16a34a",
      cursor: "pointer",
    };
    "&::-moz-range-thumb": {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "#16a34a",
      cursor: "pointer",
      border: "none",
    };
  },

  wasteReportExamples: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.6",
  },

  wasteReportExamplesTitle: {
    fontWeight: 600,
    color: "#374151",
    marginBottom: "8px",
  },
};

