import { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import { API_URL } from "../../servicios/apiConfig.jsx";

// Inicializar MercadoPago con tu Public Key
initMercadoPago(import.meta.env.VITE_APP_MP_PUBLIC_KEY);

export default function Pago({ carrito }) {

    const [preferenceId, setPreferenceId] = useState(null);

    const handlePayment = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/api/pedidos/mp/create_preference`,
                { items: carrito }
            );

            setPreferenceId(response.data.id);
            console.log("Preference creada:", response.data.id);

        } catch (error) {
            console.error("Error al crear la preferencia:", error);
        }
    };

    return (
        <div>
            <h2>Pagar con Mercado Pago</h2>

            {/* Botón que crea la preferencia */}
            <button onClick={handlePayment}>
                Generar Pago
            </button>

            {/* Renderiza el botón oficial una vez generada la preferencia */}
            {preferenceId && (
                <Wallet initialization={{ preferenceId }} />
            )}
        </div>
    );
}


/* import { initMercadoPago } from '@mercadopago/sdk-react';
import axios from "axios";


//console.log('VITE_APP_MP_PUBLIC_KEY:', import.meta.env.VITE_APP_MP_PUBLIC_KEY)

// Inicializa Mercado Pago con tu Public Key
initMercadoPago(import.meta.env.VITE_APP_MP_PUBLIC_KEY);


const response = await axios.post(
    "http://localhost:8080/api/pedidos/mp/create_preference",
    { items: carrito }
); */


// ------------- Documentación pasarela de pagos con Mercado Pago -------------------
// https://www.mercadopago.com.ar/developers/es


// --- CREDENCIALES DE PRUEBA ---
// Public Key: APP_USR-cdbda0a9-ef57-4936-9609-fee1ef4d42b3
// Access Token: APP_USR-3745178347768802-110719-4b0258f23a1cb71dc96ee18d9705c0a1-1608436973

// ---- Seller Test User ----
// user: TESTUSER1246049521
// pass: 6LfOfcCCUH
// id: 1608436973
// email: test_user_1246049521@testuser.com

// ---- Buyer Test User ----
// user: TESTUSER281984098
// pass: V14AdFChVB
// id: 1619766338
// email: test_user_281984098@testuser.com

// -------- Tarjetas de crédito de prueba --------
/*
Tarjeta	            Número                  Código de seguridad         Fecha de caducidad
Mastercard          5031 7557 3453 0604     123                         11/30
Visa                4509 9535 6623 3704     123                         11/30
American Express    3711 803032 57522       1234                        11/30
*/

// ------- Usuarios para simular estado pago ----------
/*
Estado de pago (usuario)    Descripción                     Documento de identidad
APRO                        Pago aprobado                   (DNI) 12345678
OTHE                        Rechazado por error general     (DNI) 12345678
*/