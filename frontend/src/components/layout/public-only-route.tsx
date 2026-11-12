import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/auth/use-auth";

export function PublicOnlyRoute() {
  const { autenticado } = useAuth();

  if (autenticado) return <Navigate to="/veiculos" replace />;
  return <Outlet />;
}
