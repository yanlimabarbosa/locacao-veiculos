import { Link } from "react-router";
import { AuthLayout } from "@/components/layout/auth-layout";
import { CadastroForm } from "./components/cadastro-form";

export function CadastroPage() {
  return (
    <AuthLayout title="Criar conta" description="Cadastre-se para registrar locações.">
      <CadastroForm />
      <p className="mt-6 text-sm text-muted">
        Já tem conta?{" "}
        <Link to="/login" className="font-semibold text-ink underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
