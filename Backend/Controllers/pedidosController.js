import { MercadoPagoConfig, Preference } from "mercadopago";
import { saveOrder } from "../model/DAOs/productos/PedidosModel.js";

const clientMP = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const backUrls = {
    success: `${FRONTEND_URL}/#/carrito?status=approved`,
    failure: `${FRONTEND_URL}/#/carrito?status=failure`,
    pending: `${FRONTEND_URL}/#/carrito?status=pending`,
};

export const createPreference = async (req, res) => {
    try {
        const items = req.body.items;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No se recibieron items" });
        }

        console.log("🛒 Pedido recibido:", items);

        await saveOrder({
            items,
            fecha: new Date(),
            estado: "pendiente"
        });

        const preference = new Preference(clientMP);

        const response = await preference.create({
            body: {
                items: items.map(item => ({
                    title: item.nombre,
                    quantity: item.cantidad,
                    unit_price: Number(item.precio),
                    currency_id: "ARS"
                })),
                back_urls: backUrls,
            }
        });

        console.log("✔ Preferencia creada:", response.id);

        return res.json({
            id: response.id,
            url: response.init_point || response.sandbox_init_point
        });

    } catch (error) {
        console.error("❌ Error en createPreference COMPLETO:", error);
        console.error("❌ Mensaje:", error.message);
        console.error("❌ Stack:", error.stack);

        return res.status(500).json({
            error: "No se pudo crear la preferencia",
            detalle: error.message
        });
    }
};

export const enviarPedido = async (req, res) => {
    try {
        const pedido = req.body;

        if (!pedido?.pedido?.length) {
            return res.status(400).json({ error: "Pedido inválido" });
        }

        await saveOrder({
            ...pedido,
            fecha: new Date(),
            estado: pedido.compra?.status || "completado"
        });

        return res.json({ mensaje: "Pedido registrado correctamente ✔" });

    } catch (error) {
        console.error("❌ Error en enviarPedido:", error);
        return res.status(500).json({ error: "No se pudo registrar el pedido" });
    }
};
