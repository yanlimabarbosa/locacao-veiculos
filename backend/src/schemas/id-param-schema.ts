import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number("Identificador inválido.").int().positive("Identificador inválido."),
});
