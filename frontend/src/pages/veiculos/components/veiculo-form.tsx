import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/shared/button";
import { TextField } from "@/components/shared/text-field";
import { useCriarVeiculo } from "@/hooks/veiculos/use-criar-veiculo";
import { getErrorMessage } from "@/lib/get-error-message";

const ANO_MAXIMO = new Date().getFullYear() + 1;

const veiculoSchema = z.object({
  marca: z.string().trim().min(1, "Informe a marca."),
  modelo: z.string().trim().min(1, "Informe o modelo."),
  placa: z
    .string()
    .transform((placa) => placa.toUpperCase().replace(/[^A-Z0-9]/g, ""))
    .pipe(z.string().regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, "Use o formato ABC1234 ou ABC1D23.")),
  ano: z
    .number("Informe o ano.")
    .int("O ano deve ser inteiro.")
    .min(1950, "A partir de 1950.")
    .max(ANO_MAXIMO, `Até ${ANO_MAXIMO}.`),
  valorDiaria: z.number("Informe o valor da diária.").positive("O valor deve ser positivo."),
});

type VeiculoFormInput = z.input<typeof veiculoSchema>;
type VeiculoFormData = z.output<typeof veiculoSchema>;

const VALORES_INICIAIS: VeiculoFormInput = {
  marca: "",
  modelo: "",
  placa: "",
  ano: new Date().getFullYear(),
  valorDiaria: Number.NaN,
};

export function VeiculoForm() {
  const criarVeiculo = useCriarVeiculo();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VeiculoFormInput, unknown, VeiculoFormData>({
    resolver: zodResolver(veiculoSchema),
    defaultValues: VALORES_INICIAIS,
  });

  const onSubmit = handleSubmit((dados) =>
    criarVeiculo.mutate(dados, {
      onSuccess: (veiculo) => {
        toast.success(`${veiculo.marca} ${veiculo.modelo} cadastrado na frota.`);
        reset(VALORES_INICIAIS);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  );

  return (
    <section className="rounded-xl border border-line bg-white p-5 lg:sticky lg:top-6">
      <h2 className="text-lg font-bold">Novo veículo</h2>
      <p className="mb-5 text-sm text-muted">A placa precisa ser única na frota.</p>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4" noValidate>
        <TextField label="Marca" error={errors.marca?.message} {...register("marca")} />
        <TextField label="Modelo" error={errors.modelo?.message} {...register("modelo")} />
        <TextField
          label="Placa"
          placeholder="ABC1D23"
          maxLength={8}
          className="col-span-2"
          error={errors.placa?.message}
          {...register("placa")}
        />
        <TextField label="Ano" type="number" error={errors.ano?.message} {...register("ano", { valueAsNumber: true })} />
        <TextField
          label="Diária (R$)"
          type="number"
          step="0.01"
          min="0"
          error={errors.valorDiaria?.message}
          {...register("valorDiaria", { valueAsNumber: true })}
        />
        <Button type="submit" loading={criarVeiculo.isPending} className="col-span-2 mt-1">
          Cadastrar veículo
        </Button>
      </form>
    </section>
  );
}
