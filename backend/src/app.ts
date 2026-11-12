import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { rotaNaoEncontrada } from "./middlewares/rota-nao-encontrada.js";
import { tratarErros } from "./middlewares/tratar-erros.js";
import { routes } from "./routes/index.js";

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use("/api", routes);
app.use(rotaNaoEncontrada);
app.use(tratarErros);
