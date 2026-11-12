import { PageHeader } from "@/components/shared/page-header";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { useVeiculosPage } from "./components/use-veiculos-page";
import { VeiculoForm } from "./components/veiculo-form";
import { VeiculoList } from "./components/veiculo-list";

export function VeiculosPage() {
  const { filtro, setFiltro, filtroOptions, veiculos, erro } = useVeiculosPage();

  return (
    <>
      <PageHeader title="Veículos" description="Cadastre veículos na frota e acompanhe a disponibilidade de cada um." />
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Frota</h2>
            <SegmentedControl label="Filtrar por disponibilidade" value={filtro} options={filtroOptions} onChange={setFiltro} />
          </div>
          <VeiculoList
            veiculos={veiculos.data ?? []}
            carregando={veiculos.isLoading}
            erro={erro}
            onRetry={veiculos.refetch}
          />
        </section>
        <VeiculoForm />
      </div>
    </>
  );
}
