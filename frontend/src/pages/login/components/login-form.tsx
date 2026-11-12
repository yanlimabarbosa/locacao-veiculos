import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/shared/button";
import { TextField } from "@/components/shared/text-field";
import { useLogin } from "@/hooks/auth/use-login";
import { getErrorMessage } from "@/lib/get-error-message";

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe a senha."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  });

  const onSubmit = handleSubmit((dados) =>
    login.mutate(dados, {
      onSuccess: ({ usuario }) => toast.success(`Bem-vindo, ${usuario.nome}!`),
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <TextField label="E-mail" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <TextField
        label="Senha"
        type="password"
        autoComplete="current-password"
        error={errors.senha?.message}
        {...register("senha")}
      />
      <Button type="submit" loading={login.isPending} className="mt-2">
        Entrar
      </Button>
    </form>
  );
}
