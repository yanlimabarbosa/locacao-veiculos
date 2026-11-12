const UM_DIA_EM_MS = 24 * 60 * 60 * 1000;

export function calcularDiarias(dataInicio: Date, dataPrevistaDevolucao: Date) {
  const duracaoEmMs = dataPrevistaDevolucao.getTime() - dataInicio.getTime();
  if (Number.isNaN(duracaoEmMs) || duracaoEmMs <= 0) return 0;
  return Math.ceil(duracaoEmMs / UM_DIA_EM_MS);
}
