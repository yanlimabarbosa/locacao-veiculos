import { Router } from "express";
import { locacaoController } from "../controllers/locacao-controller.js";
import { autenticar } from "../middlewares/autenticar.js";

export const locacaoRoutes = Router();

locacaoRoutes.use(autenticar);
locacaoRoutes.get("/", locacaoController.listar);
locacaoRoutes.get("/:id", locacaoController.buscarPorId);
locacaoRoutes.post("/", locacaoController.criar);
locacaoRoutes.patch("/:id/finalizar", locacaoController.finalizar);
