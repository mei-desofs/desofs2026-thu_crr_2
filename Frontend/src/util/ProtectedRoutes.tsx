import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const auth = useSelector((state: any) => state.auth);
  const user = auth?.user;
  const loggedIn = !!auth?.loggedIn;

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (user?.role || "").toString();
  const normalizedRole = userRole.toLowerCase();
  const allowed = allowedRoles.map((r) => r.toLowerCase());

  if (!allowed.includes(normalizedRole)) {
    return <Navigate to={`/${normalizedRole}-dashboard`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
