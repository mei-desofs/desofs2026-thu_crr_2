/** Application roles (must match User model ENUM). */
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

/** Reusable role sets for route policies (MT2 / SR-03). */
export const RoleGroups = {
  /** Farmer/producer applicant (before approval). */
  APPLICANT: [Role.Visitor],
  NETWORK: [Role.NetworkManager],
  CANTEEN_MGMT: [Role.CanteenManager, Role.NetworkManager],
  NUTRITION: [Role.Nutritionist],
  MENU_READ: [Role.Student, Role.NursingHome, Role.Nutritionist, Role.RefectoryStaff],
  REFECTORY: [Role.RefectoryStaff, Role.RefectoryManager],
  REFECTORY_STATS: [Role.RefectoryStaff, Role.RefectoryManager, Role.NetworkManager, Role.CanteenManager],
  SUPPLIER: [Role.Supplier],
  STOCK: [Role.StockManager],
  ORDERS: [Role.Supplier, Role.StockManager],
  RESERVATIONS: [Role.Student, Role.NursingHome],
  CATALOG_READ: [
    Role.Visitor,
    Role.Supplier,
    Role.Nutritionist,
    Role.StockManager,
    Role.RefectoryStaff,
    Role.NetworkManager,
    Role.CanteenManager,
  ],
  ADMIN_WRITE: [Role.NetworkManager],
};
