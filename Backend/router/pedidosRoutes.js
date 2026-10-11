import { Router } from "express";
import { createPreference, enviarPedido } from "../Controllers/pedidosController.js";

const router = Router();

router.post("/", enviarPedido);
router.post("/mp/create_preference", createPreference);

export default router;
