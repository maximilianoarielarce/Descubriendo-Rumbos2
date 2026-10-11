import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import productosRoutes from "./router/productosRoutes.js";
import carritoRoutes from "./router/carritoRoutes.js";
import pedidosRoutes from "./router/pedidosRoutes.js";
import uploadRoutes from "./router/uploadRoutes.js";
import authRoutes from "./router/authRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/productos", productosRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);

export default app;
