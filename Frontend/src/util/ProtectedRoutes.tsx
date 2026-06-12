import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { getDashboardPathForRole } from "../config/roles";
import { isRoleAllowedForPath, routeAccess } from "../config/routeAccess";

interface ProtectedRouteProps {
  allowedRoles: readonly string[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const auth = useSelector((state: any) => state.auth);
  const user = auth?.user;
  const loggedIn = !!auth?.loggedIn;
  const location = useLocation();

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const userRole = (user?.role || "").toString();
  const allowed = allowedRoles.map((r) => r.toLowerCase());

  if (!allowed.includes(userRole.toLowerCase())) {
    return <Navigate to={getDashboardPathForRole(userRole)} replace />;
  }

  return <>{children}</>;
};

/** Redirect authenticated users away from /login to their dashboard. */
export const GuestRoute = ({ children }: { children: ReactNode }) => {
  const auth = useSelector((state: any) => state.auth);
  if (auth?.loggedIn && auth?.user?.role) {
    return <Navigate to={getDashboardPathForRole(auth.user.role)} replace />;
  }
  return <>{children}</>;
};

/** Wrapper that reads allowed roles from routeAccess config by path. */
export const ProtectedRouteByPath = ({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) => {
  const roles = routeAccess[path];
  if (!roles) {
    return <Navigate to="/login" replace />;
  }
  return <ProtectedRoute allowedRoles={roles}>{children}</ProtectedRoute>;
};

export { isRoleAllowedForPath };
export default ProtectedRoute;
