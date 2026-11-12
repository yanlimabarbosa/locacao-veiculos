import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shared/button";
import { Placa } from "@/components/shared/placa";
import { StatusBadge } from "@/components/shared/status-badge";
import { useFinalizarLocacao } from "@/hooks/locacoes/use-finalizar-locacao";
import { formatCurrency } from "@/lib/format/format-currency";
import { formatDateTime } from "@/lib/format/format-date-time";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Locacao } from "@/types/locacao";

type LocacaoCardProps = {
  locacao: Locacao;
};

export function LocacaoCard({ locacao }: LocacaoCardProps) {
  const finalizarLocacao = useFinalizarLocacao();
  const [confirmando, setConfirmando] = useState(false);

  const ativa = locacao.status === "ATIVA";
  const { veiculo } = locacao;
  const diarias = `${locacao.quantidadeDiarias} ${locacao.quantidadeDiarias === 1 ? "diária" : "diárias"}`;
  const periodo = `${formatDateTime(locacao.dataInicio)} → ${formatDateTime(locacao.dataPrevistaDevolucao)}`;
  const devolucao = locacao.dataDevolucao ? `Devolvido em ${formatDateTime(locacao.dataDevolucao)}` : "Aguardando devolução";

  function finalizar() {
    finalizarLocacao.mutate(locacao.id, {
      onSuccess: () => toast.success(`Devolução do ${veiculo.modelo} registrada.`),
      onError: (error) => toast.error(getErrorMessage(error)),
      onSettled: () => setConfirmando(false),
    });
  }

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold">
            {veiculo.marca} {veiculo.modelo}
          </h3>
          <Placa value={veiculo.placa} />
          <StatusBadge tone={ativa ? "alerta" : "neutro"}>{ativa ? "Ativa" : "Finalizada"}</StatusBadge>
        </div>
        <p className="text-sm text-muted">{periodo}</p>
        <p className="text-xs text-muted">{devolucao}</p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="sm:text-right">
          <p className="text-xl font-extrabold tracking-tight">{formatCurrency(locacao.valorTotal)}</p>
          <p className="text-xs text-muted">{diarias}</p>
        </div>
        {ativa && !confirmando && (
          <Button variant="secondary" onClick={() => setConfirmando(true)}>
            Finalizar
          </Button>
        )}
        {ativa && confirmando && (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setConfirmando(false)} disabled={finalizarLocacao.isPending}>
              Cancelar
            </Button>
            <Button onClick={finalizar} loading={finalizarLocacao.isPending}>
              Confirmar devolução
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
