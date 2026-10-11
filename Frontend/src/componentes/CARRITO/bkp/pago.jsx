import { initMercadoPago } from '@mercadopago/sdk-react';

//console.log('VITE_APP_MP_PUBLIC_KEY:', import.meta.env.VITE_APP_MP_PUBLIC_KEY)

// Inicializa Mercado Pago con tu Public Key
initMercadoPago(import.meta.env.VITE_APP_MP_PUBLIC_KEY);


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