import { Navigate, Outlet } from "react-router";
import { FullPageLoader } from "@/components/shared/full-page-loader";
import { useAuth } from "@/hooks/auth/use-auth";

export function ProtectedRoute() {
  const { autenticado, carregando } = useAuth();

  if (carregando) return <FullPageLoader />;
  if (!autenticado) return <Navigate to="/login" replace />;
  return <Outlet />;
}
