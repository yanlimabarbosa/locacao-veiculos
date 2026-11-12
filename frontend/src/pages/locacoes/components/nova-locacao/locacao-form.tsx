import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/shared/button";
import { SelectField } from "@/components/shared/select-field";
import { TextField } from "@/components/shared/text-field";
import { useCriarLocacao } from "@/hooks/locacoes/use-criar-locacao";
import { formatCurrency } from "@/lib/format/format-currency";
import { toDatetimeLocal } from "@/lib/format/to-datetime-local";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Veiculo } from "@/types/veiculo";
import { ResumoValor } from "./resumo-valor";

type LocacaoFormProps = {
  veiculos: Veiculo[];
  veiculoIdInicial: number | null;
  onRegistrada: () => void;
};

const UM_DIA_EM_MS = 24 * 60 * 60 * 1000;

const locacaoSchema = z
  .object({
    veiculoId: z.number("Selecione um veículo.").int().positive("Selecione um veículo."),
    dataInicio: z.string().min(1, "Informe a data de início."),
    dataPrevistaDevolucao: z.string().min(1, "Informe a data de devolução."),
  })
  .refine((dados) => new Date(dados.dataPrevistaDevolucao) > new Date(dados.dataInicio), {
    message: "A devolução deve ser posterior ao início.",
    path: ["dataPrevistaDevolucao"],
  });

type LocacaoFormData = z.infer<typeof locacaoSchema>;

export function LocacaoForm({ veiculos, veiculoIdInicial, onRegistrada }: LocacaoFormProps) {
  const criarLocacao = useCriarLocacao();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LocacaoFormData>({
    resolver: zodResolver(locacaoSchema),
    defaultValues: criarValoresIniciais(veiculos, veiculoIdInicial),
  });

  const [veiculoId, dataInicio, dataPrevistaDevolucao] = useWatch({
    control,
    name: ["veiculoId", "dataInicio", "dataPrevistaDevolucao"],
  });
  const veiculoSelecionado = veiculos.find((veiculo) => veiculo.id === veiculoId);
  const semVeiculos = veiculos.length === 0;

  const onSubmit = handleSubmit((dados) =>
    criarLocacao.mutate(
      {
        veiculoId: dados.veiculoId,
        dataInicio: new Date(dados.dataInicio).toISOString(),
        dataPrevistaDevolucao: new Date(dados.dataPrevistaDevolucao).toISOString(),
      },
      {
        onSuccess: (locacao) => {
          toast.success(
            `Locação registrada: ${locacao.veiculo.modelo} por ${formatCurrency(locacao.valorTotal)}.`,
          );
          reset(criarValoresIniciais([], null));
          onRegistrada();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    ),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <SelectField
        label="Veículo"
        disabled={semVeiculos}
        error={errors.veiculoId?.message}
        {...register("veiculoId", { valueAsNumber: true })}
      >
        <option value="">{semVeiculos ? "Nenhum veículo disponível" : "Selecione um veículo"}</option>
        {veiculos.map((veiculo) => (
          <option key={veiculo.id} value={veiculo.id}>
            {veiculo.marca} {veiculo.modelo} · {veiculo.placa} · {formatCurrency(veiculo.valorDiaria)}/dia
          </option>
        ))}
      </SelectField>
      <TextField
        label="Início"
        type="datetime-local"
        error={errors.dataInicio?.message}
        {...register("dataInicio")}
      />
      <TextField
        label="Devolução prevista"
        type="datetime-local"
        error={errors.dataPrevistaDevolucao?.message}
        {...register("dataPrevistaDevolucao")}
      />
      <ResumoValor
        valorDiaria={veiculoSelecionado?.valorDiaria ?? null}
        dataInicio={dataInicio}
        dataPrevistaDevolucao={dataPrevistaDevolucao}
      />
      <Button type="submit" loading={criarLocacao.isPending} disabled={semVeiculos}>
        Registrar locação
      </Button>
    </form>
  );
}

function criarValoresIniciais(veiculos: Veiculo[], veiculoIdInicial: number | null) {
  const agora = new Date();
  const veiculoValido = veiculos.some((veiculo) => veiculo.id === veiculoIdInicial);
  return {
    veiculoId: veiculoValido && veiculoIdInicial ? veiculoIdInicial : Number.NaN,
    dataInicio: toDatetimeLocal(agora),
    dataPrevistaDevolucao: toDatetimeLocal(new Date(agora.getTime() + UM_DIA_EM_MS)),
  };
}
