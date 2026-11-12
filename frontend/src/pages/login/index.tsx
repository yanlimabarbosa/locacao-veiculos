import { Link } from "react-router";
import { AuthLayout } from "@/components/layout/auth-layout";
import { LoginForm } from "./components/login-form";

export function LoginPage() {
  return (
    <AuthLayout title="Entrar" description="Acesse sua conta para gerenciar a frota e suas locações.">
      <LoginForm />
      <p className="mt-6 text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link to="/cadastro" className="font-semibold text-ink underline-offset-4 hover:underline">
          Cadastre-se
        </Link>
      </p>
    </AuthLayout>
  );
}
