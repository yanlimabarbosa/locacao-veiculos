import { Router } from "express";
import { authController } from "../controllers/auth-controller.js";
import { autenticar } from "../middlewares/autenticar.js";

export const authRoutes = Router();

authRoutes.post("/cadastro", authController.cadastrar);
authRoutes.post("/login", authController.login);
authRoutes.get("/me", autenticar, authController.perfil);
