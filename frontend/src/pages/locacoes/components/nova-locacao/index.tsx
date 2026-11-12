import { ErrorState } from "@/components/shared/error-state";
import { useVeiculos } from "@/hooks/veiculos/use-veiculos";
import { getErrorMessage } from "@/lib/get-error-message";
import { LocacaoForm } from "./locacao-form";

type NovaLocacaoProps = {
  veiculoIdInicial: number | null;
  onRegistrada: () => void;
};

export function NovaLocacao({ veiculoIdInicial, onRegistrada }: NovaLocacaoProps) {
  const veiculos = useVeiculos("disponiveis");
  const erro = veiculos.isError ? getErrorMessage(veiculos.error) : null;

  return (
    <section className="rounded-xl border border-line bg-white p-5 lg:sticky lg:top-6">
      <h2 className="text-lg font-bold">Nova locação</h2>
      <p className="mb-5 text-sm text-muted">Toda fração de 24 horas conta como uma diária completa.</p>
      {veiculos.isLoading && <div className="h-64 animate-pulse rounded-lg bg-stone-100" />}
      {erro && <ErrorState message={erro} onRetry={veiculos.refetch} />}
      {veiculos.data && (
        <LocacaoForm
          key={veiculoIdInicial ?? "nenhum"}
          veiculos={veiculos.data}
          veiculoIdInicial={veiculoIdInicial}
          onRegistrada={onRegistrada}
        />
      )}
    </section>
  );
}
