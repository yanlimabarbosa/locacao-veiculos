import { Link } from "react-router";
import { Placa } from "@/components/shared/placa";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/format/format-currency";
import type { Veiculo } from "@/types/veiculo";

type VeiculoCardProps = {
  veiculo: Veiculo;
};

export function VeiculoCard({ veiculo }: VeiculoCardProps) {
  const diaria = formatCurrency(veiculo.valorDiaria);
  const linkLocacao = `/locacoes?veiculoId=${veiculo.id}`;

  return (
    <article className="flex h-full flex-col gap-4 rounded-xl border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{veiculo.marca}</p>
          <h3 className="text-lg font-bold leading-tight">
            {veiculo.modelo} <span className="font-medium text-muted">{veiculo.ano}</span>
          </h3>
        </div>
        <StatusBadge tone={veiculo.disponivel ? "positivo" : "alerta"}>
          {veiculo.disponivel ? "Disponível" : "Locado"}
        </StatusBadge>
      </div>
      <div className="mt-auto flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <Placa value={veiculo.placa} />
          <p className="text-sm">
            <span className="font-bold">{diaria}</span>
            <span className="text-muted"> / diária</span>
          </p>
        </div>
        {veiculo.disponivel && (
          <Link
            to={linkLocacao}
            className="rounded-lg bg-accent px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-accent-strong"
          >
            Alugar
          </Link>
        )}
      </div>
    </article>
  );
}
