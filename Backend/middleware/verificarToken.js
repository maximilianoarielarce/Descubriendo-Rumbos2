import jwt from "jsonwebtoken";

/**
 * Protege las rutas de administración (alta/edición/borrado de paquetes).
 * Espera un header "Authorization: Bearer <token>" generado por /api/auth/login.
 */
export function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const [tipo, token] = authHeader.split(" ");

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({ error: "No autorizado: falta el token de acceso" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: "No autorizado: token inválido o expirado" });
    }
}
