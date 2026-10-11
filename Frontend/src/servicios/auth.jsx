import axios from "axios";
import { API_URL } from "./apiConfig.jsx";

const url = `${API_URL}/api/auth/`;

const login = async (usuario, clave) => {
    const { data } = await axios.post(url + "login", { usuario, clave });
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUsuario", data.usuario);
    return data;
};

const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUsuario");
};

const getToken = () => localStorage.getItem("authToken");

const estaAutenticado = () => {
    const token = getToken();
    if (!token) return false;

    try {
        // el payload de un JWT es la parte del medio, en base64
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expirado = payload.exp * 1000 < Date.now();
        if (expirado) {
            logout();
            return false;
        }
        return true;
    } catch {
        return false;
    }
};

export default {
    login,
    logout,
    getToken,
    estaAutenticado
};
