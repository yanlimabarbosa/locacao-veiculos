import { useSearchParams } from "react-router";
import { useVeiculos } from "@/hooks/veiculos/use-veiculos";
import { getErrorMessage } from "@/lib/get-error-message";
import type { FiltroDisponibilidade } from "@/types/veiculo";

const FILTRO_OPTIONS: { value: FiltroDisponibilidade; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "disponiveis", label: "Disponíveis" },
  { value: "indisponiveis", label: "Locados" },
];

export function useVeiculosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filtro = parseFiltro(searchParams.get("filtro"));
  const veiculos = useVeiculos(filtro);

  function setFiltro(novoFiltro: FiltroDisponibilidade) {
    setSearchParams(novoFiltro === "todos" ? {} : { filtro: novoFiltro });
  }

  return {
    filtro,
    setFiltro,
    filtroOptions: FILTRO_OPTIONS,
    veiculos,
    erro: veiculos.isError ? getErrorMessage(veiculos.error) : null,
  };
}

function parseFiltro(valor: string | null): FiltroDisponibilidade {
  const filtroValido = FILTRO_OPTIONS.find((option) => option.value === valor);
  return filtroValido?.value ?? "todos";
}
