import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import type { Locacao } from "@/types/locacao";
import { LocacaoCard } from "./locacao-card";

type LocacaoListProps = {
  locacoes: Locacao[];
  carregando: boolean;
  erro: string | null;
  onRetry: () => void;
};

export function LocacaoList({ locacoes, carregando, erro, onRetry }: LocacaoListProps) {
  if (carregando) return <ListSkeleton />;
  if (erro) return <ErrorState message={erro} onRetry={onRetry} />;
  if (locacoes.length === 0) {
    return <EmptyState title="Nenhuma locação por aqui" description="Registre sua primeira locação no formulário ao lado." />;
  }

  return (
    <ul className="flex flex-col gap-3">
      {locacoes.map((locacao) => (
        <li key={locacao.id}>
          <LocacaoCard locacao={locacao} />
        </li>
      ))}
    </ul>
  );
}
