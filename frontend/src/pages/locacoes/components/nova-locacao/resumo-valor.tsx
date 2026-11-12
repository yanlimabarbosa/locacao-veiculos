import { formatCurrency } from "@/lib/format/format-currency";
import { calcularDiarias } from "@/lib/locacao/calcular-diarias";

type ResumoValorProps = {
  valorDiaria: string | null;
  dataInicio: string;
  dataPrevistaDevolucao: string;
};

export function ResumoValor({ valorDiaria, dataInicio, dataPrevistaDevolucao }: ResumoValorProps) {
  const diarias = calcularDiarias(new Date(dataInicio), new Date(dataPrevistaDevolucao));
  const valorEstimado = valorDiaria && diarias > 0 ? formatCurrency(Number(valorDiaria) * diarias) : "—";
  const detalhe =
    valorDiaria && diarias > 0
      ? `${diarias} ${diarias === 1 ? "diária" : "diárias"} × ${formatCurrency(valorDiaria)}`
      : "Escolha o veículo e o período";

  return (
    <div className="flex items-end justify-between rounded-lg bg-accent-soft px-4 py-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-strong">Valor estimado</p>
        <p className="text-xs text-stone-600">{detalhe}</p>
      </div>
      <p className="text-2xl font-extrabold tracking-tight">{valorEstimado}</p>
    </div>
  );
}
