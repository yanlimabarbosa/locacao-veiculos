import { useSearchParams } from "react-router";
import { useLocacoes } from "@/hooks/locacoes/use-locacoes";
import { getErrorMessage } from "@/lib/get-error-message";
import type { FiltroStatusLocacao } from "@/types/locacao";

const FILTRO_OPTIONS: { value: FiltroStatusLocacao; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "ATIVA", label: "Ativas" },
  { value: "FINALIZADA", label: "Finalizadas" },
];

export function useLocacoesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filtro = parseFiltro(searchParams.get("status"));
  const veiculoIdInicial = Number(searchParams.get("veiculoId")) || null;
  const locacoes = useLocacoes(filtro);

  function setFiltro(novoFiltro: FiltroStatusLocacao) {
    setSearchParams((atual) => {
      const proximo = new URLSearchParams(atual);
      if (novoFiltro === "todas") proximo.delete("status");
      else proximo.set("status", novoFiltro);
      return proximo;
    });
  }

  function limparVeiculoInicial() {
    setSearchParams((atual) => {
      const proximo = new URLSearchParams(atual);
      proximo.delete("veiculoId");
      return proximo;
    });
  }

  return {
    filtro,
    setFiltro,
    filtroOptions: FILTRO_OPTIONS,
    locacoes,
    erro: locacoes.isError ? getErrorMessage(locacoes.error) : null,
    veiculoIdInicial,
    limparVeiculoInicial,
  };
}

function parseFiltro(valor: string | null): FiltroStatusLocacao {
  const filtroValido = FILTRO_OPTIONS.find((option) => option.value === valor);
  return filtroValido?.value ?? "todas";
}
