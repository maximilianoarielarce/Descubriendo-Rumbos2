import { db } from "../../../Config/db.js";

export const saveOrder = async (pedido) => {
    try {
        const conexion = await db();
        const result = await conexion.collection("pedidos").insertOne(pedido);

        console.log("📝 Pedido guardado en MongoDB:", result.insertedId);
        return result;
    } catch (error) {
        console.error("❌ Error al guardar pedido:", error);
        throw error;
    }
};

