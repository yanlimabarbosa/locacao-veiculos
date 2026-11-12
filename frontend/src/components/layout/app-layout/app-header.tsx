import clsx from "clsx";
import { NavLink } from "react-router";
import { Button } from "@/components/shared/button";
import { useAuth } from "@/hooks/auth/use-auth";

const LINKS = [
  { to: "/veiculos", label: "Veículos" },
  { to: "/locacoes", label: "Minhas locações" },
];

export function AppHeader() {
  const { usuario, sair } = useAuth();

  return (
    <header className="border-b border-line bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 sm:px-6">
        <p className="text-lg font-extrabold tracking-tight">
          Locadora<span className="text-accent">.</span>
        </p>
        <nav className="order-last flex w-full gap-1 sm:order-none sm:w-auto">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
                  isActive ? "bg-accent-soft text-accent-strong" : "text-muted hover:text-ink",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">{usuario?.nome}</p>
            <p className="text-xs text-muted">{usuario?.email}</p>
          </div>
          <Button variant="secondary" onClick={sair}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
