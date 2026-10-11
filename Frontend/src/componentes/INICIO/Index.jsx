/* 

import { useEffect, useState } from "react";
import './Index.css';

const Index = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await servicioProductos.getAll();
      setProductos(data);
    };

    fetchData();
  }, []);

  const handleAgregar = (producto) => {
    console.log("Agregar producto:", producto);
  };

  return (
    <div className="inicio">
      <div className="section-cards">
        <div className="section-cards-header">
          <h1>Listado de Productos</h1>
        </div>

        <div className="section-cards-body">
         {  <ListadoProductos
            productos={productos}
            onAgregar={handleAgregar}
          /> } 
/*         </div>
      </div>
    </div>
  );
}; */

/* export default Index; */

import './Index.css'

import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'

import servicioProductos from '../../servicios/productos'
import { useStateLocalStorage } from '../../Hooks/useStateLocalStorage'
import ExperienciaValija from './ExperienciaValija'


export function Index() {
    // recurso productos local
    const [productos, setProductos] = useState([])
    const [ carrito, setCarrito ] = useStateLocalStorage('carrito', [])
    const [searchParams] = useSearchParams()
    const [valijaAbierta, setValijaAbierta] = useState(false)
    const navigate = useNavigate()

    // Efecto de montado / desmontado del componente
    useEffect(() => {
        console.warn('Componente inicio (montado)')

        ;(async () => {
            // obtiendo los productos del recurso remoto
            const productos = await servicioProductos.getAll()
            console.log(productos)
            
            // Guardo los productos obtenidos en el recurso local
            setProductos(productos)
        })()

        return () => {
            console.warn('Componente inicio (desmontado)')
        }
    }, [])


    function agregar(producto) {
        //console.log(producto)

        const carritoClon = [...carrito]
        const id = producto.id
        const productoExistente = carritoClon.find(p => p.id == id)
        //console.log(productoExistente)
        
        if(!productoExistente) {
            producto.cantidad = 1
            carritoClon.push(producto)
        }
        else {
            productoExistente.cantidad++
            const index = carritoClon.findIndex(p => p.id == id)
            carritoClon.splice(index, 1, productoExistente)
        }
        setCarrito(carritoClon)
    }

    // ----------- filtrado por el término buscado en el header -----------
    const termino = (searchParams.get('buscar') || '').trim().toLowerCase()

    const productosFiltrados = termino
        ? productos.filter(p =>
            [p.nombre, p.categoria, p.marca, p.detalles]
                .some(campo => (campo || '').toLowerCase().includes(termino))
          )
        : productos

    // Buscar con la valija cerrada la abre automáticamente,
    // así los resultados siempre salen "de adentro de la valija"
    useEffect(() => {
        if (termino) setValijaAbierta(true)
    }, [termino])
// El enlace "Inicio" del navbar resetea la home: valija cerrada
    useEffect(() => {
        const cerrarValija = () => setValijaAbierta(false)
        window.addEventListener('descubriendo:inicio', cerrarValija)
        return () => window.removeEventListener('descubriendo:inicio', cerrarValija)
    }, [])

    function toggleValija() {
        const nueva = !valijaAbierta

        // Cerrar con una búsqueda activa también limpia la búsqueda:
        // cerrar la valija siempre deja la home como recién cargada
        if (!nueva && termino) {
            setValijaAbierta(false)
            navigate('/')
            return
        }

        setValijaAbierta(nueva)
        if (nueva) {
            // Esperamos a que arranque la apertura y llevamos la vista a los paquetes
            setTimeout(() => {
                document.getElementById('paquetes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 450)
        }
    }


    // render()
    return (
        <div className="inicio">
            <ExperienciaValija abierta={valijaAbierta} onToggle={toggleValija} />
            {(termino || valijaAbierta) && (
            <div className="section-cards">
                <div className="section-cards-anchor" id="paquetes" />
                <div className="section-cards-header">
                    { termino
                        ? <>
                            <span className="eyebrow">Resultados de tu búsqueda</span>
                            <h1>“{searchParams.get('buscar')}”</h1>
                            <p className="section-cards-subtitle">
                                { productosFiltrados.length
                                    ? `${productosFiltrados.length} paquete${productosFiltrados.length === 1 ? '' : 's'} encontrado${productosFiltrados.length === 1 ? '' : 's'}.`
                                    : 'No encontramos paquetes que coincidan.'
                                } <Link to="/">Ver todos los paquetes</Link>
                            </p>
                          </>
                        : <>
                            <span className="eyebrow">Paquetes disponibles</span>
                            <h1>Elegí tu próximo destino</h1>
                            <p className="section-cards-subtitle">
                                Vuelos, hoteles y experiencias seleccionadas para que armes tu viaje sin vueltas.
                            </p>
                          </>
                    }
                </div>

                <div className="section-cards-body">
                    { productosFiltrados.length
                        ? productosFiltrados.map( (producto, i) =>
                            <section className="card" key={i}>
                                <div className="card-media">
                                    <img src={producto.foto} alt={'foto de '+ producto.nombre} />
                                    {producto.categoria &&
                                        <span className="card-tag">{producto.categoria}</span>
                                    }
                                </div>

                                <div className="card-body">
                                    <h3>{producto.nombre}</h3>

                                    {producto.marca &&
                                        <p className="card-marca">{producto.marca}</p>
                                    }

                                    {producto.detalles &&
                                        <p className="card-detalles">{producto.detalles}</p>
                                    }

                                    <div className="card-meta">
                                        <span className="card-precio">${producto.precio}</span>
                                        <span className={producto.envio ? 'card-envio si' : 'card-envio no'}>
                                            {producto.envio ? 'Incluye traslados' : 'Sin traslados'}
                                        </span>
                                    </div>

                                    <p className="card-stock">Cupos disponibles: {producto.stock}</p>

                                    <button id={"btnComprar-" + producto.id} onClick={
                                        () => agregar(producto)
                                    }>Agregar al carrito</button>
                                </div>
                            </section>
                        )
                        : <h2 className="sin-productos">
                            { termino
                                ? <>No encontramos paquetes para “{searchParams.get('buscar')}”. <Link to="/">Ver todos</Link></>
                                : 'No se encontraron productos para mostrar'
                            }
                          </h2>
                    }
                </div>
            </div>
            )}
        </div>
    )
}

export default Index; 
