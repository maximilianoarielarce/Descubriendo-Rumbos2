import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const { usuario, clave } = req.body;

    if (!usuario || !clave) {
        return res.status(400).json({ error: "Usuario y clave son obligatorios" });
    }

    const usuarioValido = usuario === process.env.ADMIN_USER;
    const claveValida = usuarioValido && await bcrypt.compare(clave, process.env.ADMIN_PASS_HASH);

    if (!usuarioValido || !claveValida) {
        return res.status(401).json({ error: "Usuario o clave incorrectos" });
    }

    const token = jwt.sign(
        { usuario },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );

    res.json({ token, usuario });
};
