import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="hidden flex-col justify-between bg-ink p-12 text-paper lg:flex">
        <p className="text-lg font-extrabold tracking-tight">
          Locadora<span className="text-accent">.</span>
        </p>
        <div className="max-w-md">
          <p className="text-4xl font-extrabold leading-tight tracking-tight">
            A frota certa, na hora certa, sem planilha.
          </p>
          <p className="mt-4 text-stone-400">
            Cadastre veículos, acompanhe a disponibilidade e registre locações com o valor calculado na hora.
          </p>
        </div>
        <p className="text-sm text-stone-500">Programação com Frameworks Web</p>
      </section>
      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-1 mb-8 text-muted">{description}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
