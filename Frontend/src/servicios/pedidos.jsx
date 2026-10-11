/* import axios from "axios";

const URL = "/api/pedidos/";

export const getPreferenceId = async (carrito) => {
  try {
    const response = await axios.post(URL + "mp/create_preference", {
      items: carrito
    });

    console.log("Preferencia:", response.data);
    return response.data.url;
  } catch (error) {
    console.error("ERROR getPreferenceId:", error.response?.data || error);
    throw error;
  }
};

const servicioPedidos = {
    getPreferenceId,
};

export default servicioPedidos;
 */

import axios from "axios";
import { API_URL } from "./apiConfig.jsx";

const URL = `${API_URL}/api/pedidos/`;

// 🔥 ADAPTAR EL CARRITO PARA MERCADO PAGO
export const getPreferenceId = async (carrito) => {
  try {
    const items = carrito.map(p => ({
      nombre: p.nombre,
      cantidad: p.cantidad,
      precio: p.precio
    }));

    const response = await axios.post(URL + "mp/create_preference", {
      items
    });

    return response.data.id; // Wallet necesita EL ID
  } catch (error) {
    console.error("ERROR getPreferenceId:", error.response?.data || error);
    throw error;
  }
};

// 🔥 FUNCIÓN enviar() que te faltaba
export const enviar = async (pedido) => {
  try {
    const response = await axios.post(URL, pedido);
    return response.data;
  } catch (error) {
    console.error("ERROR enviar:", error.response?.data || error);
    throw error;
  }
};

export default {
  getPreferenceId,
  enviar
};
