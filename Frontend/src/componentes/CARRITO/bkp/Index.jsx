import { useEffect, useState } from 'react'
import './Index.css'
import { useStateLocalStorage } from '../../Hooks/useStateLocalStorage'

import servicioPedidos from '../../servicios/pedidos'

import './pago'

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
            <h1>Carrito de Compras</h1>
            <br/><br/>
            {/* ----- Cartel de lresultado de loa operación de pago ----- */}
            { compraStatus.status != 'null' &&
                <div style={{
                    backgroundColor: compraStatus.status == 'approved'? 'lightgreen':'lightpink',
                    width: '50%',
                    margin: '0 auto',
                    padding: '10px',
                    borderRadius: '20px',
                    fontSize: '22px'
                }}>
                    <h2>Pago {compraStatus.status == 'approved'? 'exitoso':'rechazado'} </h2>
                    <hr />
                    <h3><i><u>Estado de compra:</u></i></h3>
                    <ul>
                        <li><h4>payment_id: { compraStatus.payment_id }</h4></li>
                        <li><h4>status: { compraStatus.status }</h4></li>
                        <li><h4>merchant_order_id: { compraStatus.merchant_order_id }</h4></li>
                    </ul>
                </div>
            }

            {/* --------------------------------------------------------- */}
            { carrito.length > 0  &&
                <>
                    <button className="carrito_borrar_pedir carrito_borrar" onClick={borrarCarrito}>Borrar Todo</button>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>nombre</th>
                                <th>precio</th>
                                <th>marca</th>
                                <th>foto</th>
                                {/* <th>stock</th> */}
                                <th>cantidad</th>
                                <th>subtotal</th>
                                <th>acciones</th>
                            </tr>  
                        </thead>                
                        <tbody>
                            {   
                                carrito.map( (producto, i) => 
                                    <tr key={i}>
                                        {/* <td className="centrar">{producto.id}</td> */}
                                        <td className="centrar">{i+1}</td>
                                        <td>{producto.nombre}</td>
                                        <td className="centrar">${producto.precio}</td>
                                        <td>{producto.marca}</td>
                                        <td className="centrar"><img width="75" src={producto.foto} alt={"foto de " + producto.nombre}/></td>
                                        {/* <td>{producto.stock}</td> */}
                                        <td className="centrar">
                                            {producto.cantidad}
                                            <button className="btnIncDec btnDec" onClick={() => decrementarItem(producto.id)}>-</button>
                                            <button className="btnIncDec btnInc"onClick={() => incrementarItem(producto.id)}>+</button>
                                        </td>
                                        <td className="centrar">${ producto.precio * producto.cantidad }</td>
                                        <td>
                                            <button className="btnBorrar"onClick={() => borrarItem(producto.id)}>Borrar</button>
                                        </td>
                                    </tr>   
                                )
                            }
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                {/* <th></th> */}
                                <th><h3>TOTAL</h3></th>
                                <th><h3>${ carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0 ) }</h3></th>
                                <th></th>
                            </tr>
                        </tbody>
                    </table>
                    {/* <button className="carrito_borrar_pedir carrito_pedir" onClick={pedir}>Pedir</button> */}

                    {/* Renderiza el botón de pago */}
                    {/* <div style={{ width: '300px', margin: '20px auto' }}>
                        <Wallet initialization={{ preferenceId: '1608436973-3481035c-d186-4ca5-ace9-d7bee6d4d5a0' }} />
                    </div> */}

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


                </>
            }
            { !carrito.length && <h2>No se encontraron pedidos para mostrar</h2> }
        </div>
   )
}