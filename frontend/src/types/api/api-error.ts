export type ApiError = {
  mensagem: string;
  erros?: { campo: string; mensagem: string }[];
};
