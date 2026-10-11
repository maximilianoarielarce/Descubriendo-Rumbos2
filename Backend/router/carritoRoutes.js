import { Router } from "express";
import { recibirCarrito } from "../Controllers/carritoController.js";

const router = Router();

router.post("/", recibirCarrito);

export default router;
