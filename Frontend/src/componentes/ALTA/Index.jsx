import { useEffect, useState } from 'react'

import './Index.css'

import servicioProductos from '../../servicios/productos' 
import { ObtenerFoto } from './ObtenerFoto'


export function Index() {
    console.log('Index (Alta)')


    const prodClear = {
        nombre: '',
        precio: '',
        stock: '',
        marca: '',
        categoria: '',
        detalles: '',
        foto: '',
        envio: false,
    }

    const tiposDeViaje = ['Paquete', 'Vuelo', 'Hotel', 'Excursión', 'Crucero', 'Traslado']

    // recurso productos local
    const [productos, setProductos] = useState([])
    const [producto, setProducto] = useState(prodClear)
    const [productoDirty, setProductoDirty] = useState(prodClear)
    const [editarID, setEditarID] = useState(null)

    // Efecto de montado / desmontado del componente
    useEffect(() => {
        console.warn('Componente alta (montado)')

        ;(async () => {
            // obtiendo los productos del recurso remoto
            const productos = await servicioProductos.getAll()
            console.log(productos)

            // Guardo los productos obtenidos en el recurso local
            setProductos(productos)
        })()

        return () => {
            console.warn('Componente alta (desmontado)')
        }
    }, [])


    async function agregar(e) {
        e.preventDefault()

        console.log(producto)

        if(editarID) {
            // actualizamos el producto en el recurso remoto
            const productoActualizado = await servicioProductos.actualizar(editarID, producto)
            console.log(productoActualizado)

            // actualizamos el producto en el recurso local
            const productosClon = [...productos]
            const index = productosClon.findIndex(p => p.id == productoActualizado.id)
            productosClon.splice(index, 1, productoActualizado)
            setProductos(productosClon) 

            setEditarID(null)
        }
        else {
            // guardamos el producto en el recurso remoto
            const productoGuardado = await servicioProductos.guardar(producto)
            console.log(productoGuardado)

            // guardamos el producto en el recurso local
            const productosClon = [...productos]
            productosClon.push(productoGuardado)
            setProductos(productosClon)                  
        }

        // borro los campos de entrada del formulario
        setProducto(prodClear)
        // borro el estado dirty de los campos de entrada del formulario
        setProductoDirty(prodClear)
    }

    async function borrar(id) {
        console.log('borrar', id)

        if(confirm(`¿Está seguro de borrar el producto de id ${id}?`)) {
            // borramos el producto en el recurso remoto
            const productoEliminado = await servicioProductos.eliminar(id)

            // borramos el producto en el recurso local
            const productosClon = [...productos]
            const index = productosClon.findIndex(p => p.id == productoEliminado.id)
            productosClon.splice(index, 1)
            setProductos(productosClon) 
        }        
    }

    function cancelar(id) {
        console.log('cancelar', id)

        setEditarID(null)
        setProducto(prodClear)
    }

    function editar(id) {
        console.log('editar', id)

        setEditarID(id)

        const producto = productos.find(p => p.id == id)
        //console.log(producto)
        setProducto(producto)
    }

    // admite nombres de paquetes/destinos reales: letras (con acentos), números, espacios y puntuación básica
    const nombreNoValido = () => !/^[\p{L}\p{N}\s.,'-]{3,60}$/u.test(producto.nombre)

    function formularioNoValido() {
        return (
            nombreNoValido() || 
            producto.precio == '' ||
            producto.stock == '' ||
            producto.marca == '' ||
            producto.categoria == '' ||
            producto.detalles == '' ||
            producto.foto == ''
        )
    }

    const escribirCampoFoto = urlFoto => {
        console.log('urlFoto', urlFoto)

        const productoClon = {...producto}
        productoClon.foto = urlFoto
        setProducto(productoClon)
    }

    return (
        <div className="alta">
            <div className="alta-header">
                <span className="eyebrow">Panel de administración</span>
                <h1>Alta de paquetes y viajes</h1>
                <p className="alta-subtitle">Cargá, editá o quitá los viajes que se muestran en el catálogo.</p>
            </div>

            <form className="alta-form" onSubmit={agregar}>
                {/* <!-- campo nombre --> */}
                <div className="input-group">
                    <label htmlFor="nombre">Nombre del paquete / destino</label>
                    <input id="nombre" type="text" name="nombre" placeholder="Ej: Cancún Todo Incluido 7 noches" value={producto.nombre} onChange={
                        e => {
                            productoDirty.nombre = true
                            setProducto({...producto, nombre: e.target.value})
                        }
                    } />
                    <div className="error-detail">
                        { (nombreNoValido() && productoDirty.nombre) && <span>Ingresá un nombre de 3 a 60 caracteres</span> }
                    </div>
                </div>

                {/* <!-- campo precio --> */}
                <div className="input-group">
                    <label htmlFor="precio">Precio (por persona, en USD)</label>
                    <input id="precio" type="number" name="precio" min="0" value={producto.precio} onChange={
                        e => setProducto({...producto, precio: +e.target.value})
                    }/>
                    <div className="error-detail"></div>
                </div>

                {/* <!-- campo stock --> */}
                <div className="input-group">
                    <label htmlFor="stock">Cupos disponibles</label>
                    <input id="stock" type="number" name="stock" min="0" value={producto.stock} onChange={
                        e => setProducto({...producto, stock: parseInt(e.target.value)})
                    } />
                    <div className="error-detail"></div>
                </div>

                {/* <!-- campo marca (proveedor) --> */}
                <div className="input-group">
                    <label htmlFor="marca">Aerolínea / hotel / operador</label>
                    <input id="marca" type="text" name="marca" placeholder="Ej: Aerolíneas Argentinas" value={producto.marca} onChange={
                        e => setProducto({...producto, marca: e.target.value})
                    } />
                    <div className="error-detail"></div>
                </div>

                {/* <!-- campo categoria (tipo de viaje) --> */}
                <div className="input-group">
                    <label htmlFor="categoria">Tipo de viaje</label>
                    <select id="categoria" name="categoria" value={producto.categoria} onChange={
                        e => setProducto({...producto, categoria: e.target.value})
                    }>
                        <option value="">Elegí una opción</option>
                        { tiposDeViaje.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>) }
                    </select>
                    <div className="error-detail"></div>
                </div>

                {/* <!-- campo detalles --> */}
                <div className="input-group">
                    <label htmlFor="detalles">Descripción del viaje</label>
                    <textarea id="detalles" name="detalles" rows="3" placeholder="Incluye, fechas, duración, régimen de comidas, etc." value={producto.detalles} onChange={
                        e => setProducto({...producto, detalles: e.target.value})
                    } />
                    <div className="error-detail"></div>
                </div>

                {/* <!-- campo foto --> */}
                <div className="input-group">
                    <label htmlFor="foto">Foto del destino</label>
                    <input id="foto" type="text" name="foto" placeholder="URL de la imagen" value={producto.foto} onChange={
                        e => setProducto({...producto, foto: e.target.value})
                    } />

                    {/* Zona de obtención de la foto del producto */}
                    <ObtenerFoto escribirCampoFoto={escribirCampoFoto} />

                    <div className="error-detail"></div>
                </div>

                {/* <!-- campo envio (incluye traslados) --> */}
                <div className="input-group input-group-checkbox">
                    <input id="envio" type="checkbox" name="envio" checked={producto.envio} onChange={
                        e => setProducto({...producto, envio: e.target.checked})
                    } />
                    <label htmlFor="envio">Incluye traslados</label>
                </div>

                {/* <!-- botón de envío --> */}
                <button className={editarID? 'btnActualizar':'btnAgregar'} disabled={formularioNoValido()}>
                    { editarID? 'Actualizar paquete':'Agregar paquete' }
                </button>
            </form>

            {/* <!-- ------------------------------------------------------------ --> */}
            <h2>Paquetes cargados</h2>

            <div className="table-responsive">
                { productos.length
                    ? <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Cupos</th>
                                <th>Proveedor</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Foto</th>
                                <th>Traslados</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            { 
                                productos.map( (producto, i) => 
                                    <tr key={i}>
                                        {/* <td className="centrar">{producto.id}</td> */}
                                        <td className="centrar">{i+1}</td>
                                        <td>{producto.nombre}</td>
                                        <td className="centrar">${producto.precio}</td>
                                        <td className="centrar">{producto.stock}</td>
                                        <td>{producto.marca}</td>
                                        <td>{producto.categoria}</td>
                                        <td>{producto.detalles}</td>
                                        <td className="centrar">
                                            <img width="75" src={producto.foto} alt={"foto de " + producto.nombre }/>
                                        </td>
                                        <td className="centrar">{producto.envio? 'Sí':'No'}</td>
                                        <td>
                                            <button disabled={ editarID } className="borrar-editar btnBorrar" onClick={
                                                () => borrar(producto.id)
                                            }>Borrar</button>
                                            
                                            { editarID && (editarID == producto.id)
                                                ? <button className="borrar-editar btnCancelar" onClick={
                                                    () => cancelar(producto.id)
                                                }>Cancelar</button>

                                                : <button className="borrar-editar btnEditar" onClick={
                                                    () => editar(producto.id)
                                                }>Editar</button>
                                            }
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    : <h2 className="sin-datos">Todavía no cargaste ningún paquete</h2>
                }
            </div>

        </div>
    )
}