/** Must match Backend User model roles and Backend/src/Config/roles.ts */
export const Role = {
  Visitor: "Visitor",
  Supplier: "Supplier",
  NetworkManager: "NetworkManager",
  Nutritionist: "Nutritionist",
  Student: "Student",
  NursingHome: "NursingHome",
  RefectoryStaff: "RefectoryStaff",
  StockManager: "StockManager",
  CanteenManager: "CanteenManager",
  RefectoryManager: "RefectoryManager",
} as const;

export type AppRole = (typeof Role)[keyof typeof Role];

export const RoleGroups = {
  APPLICANT: [Role.Visitor],
  NETWORK: [Role.NetworkManager],
  CANTEEN_MGMT: [Role.CanteenManager, Role.NetworkManager],
  NUTRITION: [Role.Nutritionist],
  MENU_READ: [Role.Student, Role.NursingHome],
  REFECTORY: [Role.RefectoryStaff, Role.RefectoryManager],
  REFECTORY_STATS: [
    Role.RefectoryStaff,
    Role.RefectoryManager,
    Role.NetworkManager,
    Role.CanteenManager,
  ],
  SUPPLIER: [Role.Supplier],
  STOCK: [Role.StockManager],
  ORDERS: [Role.Supplier, Role.StockManager],
  RESERVATIONS: [Role.Student, Role.NursingHome, Role.RefectoryStaff],
} as const;

/** Default home route after login (per role). */
export const roleDashboardPath: Record<AppRole, string> = {
  [Role.Visitor]: "/visitor-dashboard",
  [Role.Supplier]: "/supplier-dashboard",
  [Role.NetworkManager]: "/network-dashboard",
  [Role.Nutritionist]: "/nutritionist-dashboard",
  [Role.Student]: "/student-dashboard",
  [Role.NursingHome]: "/nursinghome-dashboard",
  [Role.RefectoryStaff]: "/refectorystaff-dashboard",
  [Role.StockManager]: "/stockmanager-dashboard",
  [Role.CanteenManager]: "/canteenmanager-dashboard",
  [Role.RefectoryManager]: "/refectorymanager-dashboard",
};

export function getDashboardPathForRole(role: string | undefined): string {
  if (role && role in roleDashboardPath) {
    return roleDashboardPath[role as AppRole];
  }
  return "/login";
}
