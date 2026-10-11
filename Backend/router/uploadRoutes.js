import { Router } from "express";
import { uploadMiddleware, subirImagen } from "../Controllers/uploadController.js";
import { verificarToken } from "../middleware/verificarToken.js";

const router = Router();

router.post("/", verificarToken, (req, res) => {
    uploadMiddleware(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });
        await subirImagen(req, res);
    });
});

export default router;
