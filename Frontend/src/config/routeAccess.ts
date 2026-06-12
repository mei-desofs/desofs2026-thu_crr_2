import { Role, RoleGroups } from "./roles";

/** Path → roles allowed (aligned with Backend route policies / SRS flows). */
export const routeAccess: Record<string, readonly string[]> = {
  "/supplier-dashboard": RoleGroups.SUPPLIER,
  "/network-dashboard": RoleGroups.NETWORK,
  "/suppliers-list": RoleGroups.NETWORK,
  "/parishes-list": RoleGroups.NETWORK,
  "/application-evaluation": RoleGroups.NETWORK,
  "/network-canteen-statistics": RoleGroups.NETWORK,
  "/network-refectory-statistics": RoleGroups.NETWORK,
  "/network-producer-statistics": RoleGroups.NETWORK,
  "/performance": RoleGroups.REFECTORY_STATS,
  "/nutritionist-dashboard": RoleGroups.NUTRITION,
  "/create-menu": RoleGroups.NUTRITION,
  "/stockmanager-dashboard": RoleGroups.STOCK,
  "/sm-orders": RoleGroups.STOCK,
  "/student-dashboard": [Role.Student],
  "/nursinghome-dashboard": [Role.NursingHome],
  "/weekmenu": RoleGroups.MENU_READ,
  "/reservation": RoleGroups.MENU_READ,
  "/refectorystaff-dashboard": [Role.RefectoryStaff],
  "/reservations-view": [Role.RefectoryStaff],
  "/refectorymanager-dashboard": [Role.RefectoryManager],
  "/statistics-dashboard": [Role.RefectoryManager, Role.RefectoryStaff],
  "/bioPercentage-screen": [Role.RefectoryManager, Role.RefectoryStaff],
  "/waste-percentage-screen": [Role.RefectoryManager, Role.RefectoryStaff],
  "/orders": RoleGroups.SUPPLIER,
  "/canteenmanager-dashboard": [Role.CanteenManager],
  "/suppliers-list-cm": [Role.CanteenManager],
  "/parishes-list-cm": [Role.CanteenManager],
  "/canteen-statistics": [Role.CanteenManager],
  "/application": RoleGroups.APPLICANT,
  "/visitor-dashboard": RoleGroups.APPLICANT,
};

export function isRoleAllowedForPath(path: string, role: string): boolean {
  const allowed = routeAccess[path];
  if (!allowed) return false;
  return allowed.some((r) => r.toLowerCase() === role.toLowerCase());
}
