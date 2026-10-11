import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Solo se permiten imágenes"));
    }
});

export const uploadMiddleware = upload.single("archivo");

const subirABuffer = (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "descubriendo-rumbos" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });

export const subirImagen = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se recibió ningún archivo" });
    }

    const cloudinaryVariables = [
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
    ];
    const cloudinaryNoConfigurado = cloudinaryVariables.some((variable) => {
        const valor = process.env[variable];
        return !valor || /^\*+$/.test(valor);
    });

    if (cloudinaryNoConfigurado) {
        return res.status(500).json({ error: "Cloudinary no está configurado" });
    }

    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const result = await subirABuffer(req.file.buffer);
        return res.json({ urlFoto: result.secure_url });
    } catch (error) {
        console.error("Error al subir a Cloudinary:", error);
        return res.status(500).json({ error: "No se pudo subir la imagen" });
    }
};
