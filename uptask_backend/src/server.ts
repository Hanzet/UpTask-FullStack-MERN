import { corsConfig } from "../config/cors";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

connectDB(); // Conectar a la base de datos (Lo ponemos antes del app para que se conecte antes de que se ejecute el servidor)

const app = express(); // Crear el servidor

app.use(cors(corsConfig)); // Configurar CORS

app.use(express.json()); // Habilitar la lectura de datos en formato JSON

// Routes (utilizamos app.use para que se ejecuten todas las rutas)

app.use('/api/projects', projectRoutes);

export default app;