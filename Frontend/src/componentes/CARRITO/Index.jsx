import { useEffect, useState } from 'react'
import './Index.css'
import { useStateLocalStorage } from '../../Hooks/useStateLocalStorage'

/* import servicioPedidos from '../../servicios/pedidos' */
import servicioPedidos from '../../servicios/pedidos.jsx'


import './pago.jsx'

import { Wallet } from '@mercadopago/sdk-react';
import { useNavigate } from 'react-router'


export function Index() {
    const [carrito, setCarrito] = useStateLocalStorage('carrito', [])
    const [pagar, setPagar] = useState(false)
    const [compraStatus, setCompraStatus] = useState({
        payment_id: 'null',
        status: 'null',
        merchant_order_id: 'null'
    })

    const navigate = useNavigate()

    useEffect(() => {
        console.warn('useEffect carrito')

        async function recibirDatosPago() {
            const parameters = new URL(window.location.href.replace(/#\//g, ''))

            // https://localhost:5173/#/carrito?collection_id=132871553401&collection_status=approved&payment_id=132871553401&status=approved&external_reference=null&payment_type=credit_card&merchant_order_id=35504449332&preference_id=1608436973-b310eec5-c36d-47d3-98ff-7c4e7156f817&site_id=MLA&processing_mode=aggregator&merchant_account_id=null
            /* console.log(parameters.searchParams.get('payment_id'))
            console.log(parameters.searchParams.get('status'))
            console.log(parameters.searchParams.get('merchant_order_id')) */

            const compra = {}
            compra.payment_id = parameters.searchParams.get('payment_id') || 'null'
            compra.status = parameters.searchParams.get('status') || 'null'
            compra.merchant_order_id = parameters.searchParams.get('merchant_order_id') || 'null'

            console.log(compra)

            if(compra.status != 'null') {
                setCompraStatus(compra)
                //console.log(compraStatus)
                if(compra.status == 'approved') {
                    await generarPedido(compra)
                    navigate('/carrito')
                    await new Promise(r => setTimeout(r,3000))
                    navigate('/')
                }
            }
        }
        recibirDatosPago()

    }, [])

    function borrarCarrito() {
        console.log('borrarCarrito')

        if(confirm('¿Está seguro de borrar todo el carrito?')) {
            setCarrito([])
            setPagar(false)
        }
    }

    ///async function pedir() {
    async function generarPedido(compra) {
        //if(confirm('¿Esta seguro de realizar el pedido?')) {
            console.error('generar pedido')
            const pedido = { fyh: new Date().toLocaleString(), compra, pedido: carrito }

            console.warn('Enviar pedido...')
            await servicioPedidos.enviar(pedido)
            console.error('Pedido recibido!')

            setCarrito([])
        //}
    }

    function decrementarItem(id) {
        const carritoClon = [...carrito]
        const producto = carritoClon.find(p => p.id == id)
        //console.log(producto)
        if(producto.cantidad > 1) {
            producto.cantidad--
            setCarrito(carritoClon)
            setPagar(false)
        }
    }

    function incrementarItem(id) {
        const carritoClon = [...carrito]
        const producto = carritoClon.find(p => p.id == id)
        //console.log(producto)
        if(producto.cantidad < producto.stock) {
            producto.cantidad++
            setCarrito(carritoClon)  
            setPagar(false)
        }
    }    

    function borrarItem(id) {
        if(confirm(`¿Está seguro de borrar el producto del carrito de id ${id}?`)) {
            // borramos el producto en el recurso local
            const carritoClon = [...carrito]
            const index = carritoClon.findIndex(p => p.id == id)
            carritoClon.splice(index, 1)
            setCarrito(carritoClon)
            setPagar(false)
        }
    }

    // ----------- CONFIGURACIÓN y CONTROL DEL BOTÓN DE PAGO (Wallet) ---------------
    const customization = {
        theme:'default',
        valueProp: 'security_safety',
        customStyle: {
            //valuePropColor: 'black',
            buttonHeight: '60px',
            borderRadius: '40px',
            verticalPadding: '10px',
            horizontalPadding: '10px',
        }        
    }

    const onReady = () => {
        console.log('onReady')
    }

    const onError = error => {
        console.error('onError:', error.message)
    }

    const onSubmit = () => {
        console.warn('onSubmit')

        //return Promise.resolve('1608436973-3481035c-d186-4ca5-ace9-d7bee6d4d5a0')
        return new Promise((resolve, reject) => {
            //resolve('1608436973-3481035c-d186-4ca5-ace9-d7bee6d4d5a0')
            servicioPedidos.getPreferenceId(carrito)
                .then(preferenceId => resolve(preferenceId)) // es igual a -> .then(resolve)
                .catch(error => reject(error))               // es igual a -> .catch(reject)
        })
    }
    // ------------------------------------------------------------------------------

    return (
        <div className="carrito">
            <div className="carrito-header">
                <span className="eyebrow">Tu selección</span>
                <h1>Carrito de viajes</h1>
                <p className="carrito-subtitle">Revisá los paquetes elegidos antes de confirmar el pago.</p>
            </div>

            {/* ----- Cartel de resultado de la operación de pago ----- */}
            { compraStatus.status != 'null' &&
                <div className={compraStatus.status == 'approved' ? 'carrito-status ok' : 'carrito-status error'}>
                    <h2>Pago {compraStatus.status == 'approved'? 'exitoso':'rechazado'}</h2>
                    <ul>
                        <li><span>N° de pago</span> {compraStatus.payment_id}</li>
                        <li><span>Estado</span> {compraStatus.status}</li>
                        <li><span>N° de orden</span> {compraStatus.merchant_order_id}</li>
                    </ul>
                </div>
            }

            {/* --------------------------------------------------------- */}
            { carrito.length > 0  &&
                <div className="carrito-body">
                    <button className="carrito_borrar_pedir carrito_borrar" onClick={borrarCarrito}>Vaciar carrito</button>

                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Paquete</th>
                                    <th>Precio</th>
                                    <th>Proveedor</th>
                                    <th>Foto</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    carrito.map( (producto, i) =>
                                        <tr key={i}>
                                            <td className="centrar">{i+1}</td>
                                            <td>{producto.nombre}</td>
                                            <td className="centrar">${producto.precio}</td>
                                            <td>{producto.marca}</td>
                                            <td className="centrar"><img width="60" src={producto.foto} alt={"foto de " + producto.nombre}/></td>
                                            <td className="centrar">
                                                <div className="stepper">
                                                    <button className="btnIncDec btnDec" onClick={() => decrementarItem(producto.id)}>-</button>
                                                    <span>{producto.cantidad}</span>
                                                    <button className="btnIncDec btnInc" onClick={() => incrementarItem(producto.id)}>+</button>
                                                </div>
                                            </td>
                                            <td className="centrar">${ producto.precio * producto.cantidad }</td>
                                            <td>
                                                <button className="btnBorrar" onClick={() => borrarItem(producto.id)}>Borrar</button>
                                            </td>
                                        </tr>
                                    )
                                }
                                <tr className="fila-total">
                                    <th colSpan="6">TOTAL</th>
                                    <th className="centrar">${ carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0 ) }</th>
                                    <th></th>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    { !pagar
                        ? <button className="carrito_borrar_pedir carrito_pedir" onClick={() => setPagar(true)}>
                            Pagar
                          </button>

                        : <div id="wallet-container">
                            { /* https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-settings/configure-button-appearance#editor_2 */ }
                            <Wallet 
                                customization={customization}
                                onReady={onReady}
                                onError={onError}
                                onSubmit={onSubmit}
                            />
                          </div>                    
                    }
                </div>
            }
            { !carrito.length && <h2 className="sin-datos">Todavía no agregaste ningún viaje al carrito</h2> }
        </div>
   )
}