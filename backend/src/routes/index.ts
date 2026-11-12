import { Router } from "express";
import { authRoutes } from "./auth-routes.js";
import { locacaoRoutes } from "./locacao-routes.js";
import { veiculoRoutes } from "./veiculo-routes.js";

export const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
routes.use("/auth", authRoutes);
routes.use("/veiculos", veiculoRoutes);
routes.use("/locacoes", locacaoRoutes);
