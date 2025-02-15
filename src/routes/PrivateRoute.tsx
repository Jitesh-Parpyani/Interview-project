// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function PrivateRoute() {
  const { isAuthenticated, token } = useAuthStore((s) => s);
  // Additional check if you want to ensure there's a token
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
