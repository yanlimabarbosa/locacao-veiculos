import { Router } from "express";
import { veiculoController } from "../controllers/veiculo-controller.js";
import { autenticar } from "../middlewares/autenticar.js";

export const veiculoRoutes = Router();

veiculoRoutes.use(autenticar);
veiculoRoutes.get("/", veiculoController.listar);
veiculoRoutes.get("/:id", veiculoController.buscarPorId);
veiculoRoutes.post("/", veiculoController.criar);
