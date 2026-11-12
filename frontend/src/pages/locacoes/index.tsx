import { PageHeader } from "@/components/shared/page-header";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { LocacaoList } from "./components/locacao-list";
import { NovaLocacao } from "./components/nova-locacao";
import { useLocacoesPage } from "./components/use-locacoes-page";

export function LocacoesPage() {
  const { filtro, setFiltro, filtroOptions, locacoes, erro, veiculoIdInicial, limparVeiculoInicial } =
    useLocacoesPage();

  return (
    <>
      <PageHeader title="Minhas locações" description="Registre uma nova locação e acompanhe seu histórico." />
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Histórico</h2>
            <SegmentedControl label="Filtrar por status" value={filtro} options={filtroOptions} onChange={setFiltro} />
          </div>
          <LocacaoList
            locacoes={locacoes.data ?? []}
            carregando={locacoes.isLoading}
            erro={erro}
            onRetry={locacoes.refetch}
          />
        </section>
        <NovaLocacao veiculoIdInicial={veiculoIdInicial} onRegistrada={limparVeiculoInicial} />
      </div>
    </>
  );
}
