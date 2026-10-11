import { Router } from "express";
import {
    getProductos,
    getProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from "../Controllers/productosController.js";
import { verificarToken } from "../middleware/verificarToken.js";

const router = Router();

// Rutas públicas: cualquier visitante puede ver el catálogo de viajes
router.get("/", getProductos);
router.get("/:id", getProducto);

// Rutas protegidas: sólo un administrador autenticado puede dar de alta,
// editar o borrar paquetes
router.post("/", verificarToken, crearProducto);
router.put("/:id", verificarToken, actualizarProducto);
router.delete("/:id", verificarToken, eliminarProducto);

export default router;
