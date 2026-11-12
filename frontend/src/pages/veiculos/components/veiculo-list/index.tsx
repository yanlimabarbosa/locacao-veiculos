import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListSkeleton } from "@/components/shared/list-skeleton";
import type { Veiculo } from "@/types/veiculo";
import { VeiculoCard } from "./veiculo-card";

type VeiculoListProps = {
  veiculos: Veiculo[];
  carregando: boolean;
  erro: string | null;
  onRetry: () => void;
};

export function VeiculoList({ veiculos, carregando, erro, onRetry }: VeiculoListProps) {
  if (carregando) return <ListSkeleton />;
  if (erro) return <ErrorState message={erro} onRetry={onRetry} />;
  if (veiculos.length === 0) {
    return <EmptyState title="Nenhum veículo encontrado" description="Cadastre um veículo ou altere o filtro." />;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {veiculos.map((veiculo) => (
        <li key={veiculo.id}>
          <VeiculoCard veiculo={veiculo} />
        </li>
      ))}
    </ul>
  );
}
