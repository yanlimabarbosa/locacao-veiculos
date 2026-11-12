import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/shared/button";
import { TextField } from "@/components/shared/text-field";
import { useCadastro } from "@/hooks/auth/use-cadastro";
import { useLogin } from "@/hooks/auth/use-login";
import { getErrorMessage } from "@/lib/get-error-message";

const cadastroSchema = z.object({
  nome: z.string().trim().min(2, "O nome deve ter ao menos 2 caracteres."),
  email: z.email("Informe um e-mail válido."),
  senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
});

type CadastroFormData = z.infer<typeof cadastroSchema>;

export function CadastroForm() {
  const cadastro = useCadastro();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { nome: "", email: "", senha: "" },
  });

  const onSubmit = handleSubmit(async (dados) => {
    try {
      await cadastro.mutateAsync(dados);
      await login.mutateAsync({ email: dados.email, senha: dados.senha });
      toast.success("Conta criada com sucesso!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <TextField label="Nome" autoComplete="name" error={errors.nome?.message} {...register("nome")} />
      <TextField label="E-mail" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <TextField
        label="Senha"
        type="password"
        autoComplete="new-password"
        hint="Mínimo de 6 caracteres."
        error={errors.senha?.message}
        {...register("senha")}
      />
      <Button type="submit" loading={cadastro.isPending || login.isPending} className="mt-2">
        Criar conta
      </Button>
    </form>
  );
}
