import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./components/layout/app-layout";
import { ProtectedRoute } from "./components/layout/protected-route";
import { PublicOnlyRoute } from "./components/layout/public-only-route";
import { CadastroPage } from "./pages/cadastro";
import { LocacoesPage } from "./pages/locacoes";
import { LoginPage } from "./pages/login";
import { VeiculosPage } from "./pages/veiculos";

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/cadastro", element: <CadastroPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/veiculos", element: <VeiculosPage /> },
          { path: "/locacoes", element: <LocacoesPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/veiculos" replace /> },
]);
