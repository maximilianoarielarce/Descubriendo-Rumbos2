import { useEffect, useRef, useState } from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router';
import { Link } from 'react-router-dom';

/* Barra de navegación */
import Navbar from './componentes/Navbar';

/* Componentes a rutear */
import Index from './componentes/INICIO/Index';
import { Index as Alta } from './componentes/ALTA/Index';
import { Index as Carrito } from './componentes/CARRITO/Index';
import { Index as Login } from './componentes/LOGIN/Index';
import { RutaProtegida } from './componentes/RutaProtegida';
import Contacto from './componentes/CONTACTO/Index';
import Nosotros from './componentes/NOSOTROS/Index';
import { Index as Otra } from './componentes/OTRA/Index';
import Footer from './componentes/Footer';
import PreguntasFrecuentes from './componentes/PREGUNTASFRECUENTES/Index';
import PoliticaDePrivacidad from './componentes/POLITICADEPRIVACIDAD/Index';
import TerminosCondiciones from './componentes/TERMINOSCONDICIONES/Index';




function App() {
  const [adminAccessVisible, setAdminAccessVisible] = useState(false)

  return (
    <>
      <HashRouter>
        
        <Encabezado
          adminAccessVisible={adminAccessVisible}
          onToggleAdminAccess={() => setAdminAccessVisible(visible => !visible)}
        />

        <main>
          <Routes>
            {/* Página principal */}
            <Route index element={<Index />} />

            {/* Rutas secundarias */}
            <Route path="/login" element={adminAccessVisible ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/alta" element={
                <RutaProtegida><Alta /></RutaProtegida>
            } />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/otra" element={<Otra />} />
            <Route path="/preguntasfrecuentes" element={<PreguntasFrecuentes />} />
            <Route path="/politicaprivacidad" element={<PoliticaDePrivacidad />} />
            <Route path="/terminoscondiciones" element={<TerminosCondiciones />} />





            {/* Ruta fallback */}
            <Route path="*" element={<Index />} />
          </Routes>

        </main>

        <Footer/>

      </HashRouter>
    </>
  );
}

/* Encabezado del sitio: el buscador sólo tiene sentido en la home,
   así que no se repite en el resto de las páginas (contacto, nosotros,
   alta, carrito, login, legales, etc.) */
function Encabezado({ adminAccessVisible, onToggleAdminAccess }) {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const clicksLogo = useRef({ cantidad: 0, ultimoClick: 0 })
  const esHome = pathname === '/'
  const seccionesFooter = {
    '/nosotros': 'Nosotros',
    '/preguntasfrecuentes': 'Preguntas frecuentes',
    '/contacto': 'Contacto',
    '/politicaprivacidad': 'Políticas de Privacidad',
    '/terminoscondiciones': 'Términos y Condiciones',
  }
  const seccionActual = seccionesFooter[pathname]

  function manejarClickLogo() {
    const ahora = Date.now()
    const cantidad = ahora - clicksLogo.current.ultimoClick <= 800
      ? clicksLogo.current.cantidad + 1
      : 1

    clicksLogo.current = { cantidad, ultimoClick: ahora }

    if (cantidad === 3) {
      clicksLogo.current = { cantidad: 0, ultimoClick: 0 }
      onToggleAdminAccess()
    }
  }

  function buscar(e) {
    e.preventDefault()
    const termino = e.target.elements.termino.value.trim()
    navigate(termino ? `/?buscar=${encodeURIComponent(termino)}` : '/')
  }

  return (
    <header>
      <Navbar mostrarAccesoAdmin={adminAccessVisible} />

      <div className="logo-contenedor">
        <button type="button" className="logo-trigger" onClick={manejarClickLogo} aria-label="Logo Descubriendo Rumbos">
          <img
            src="/Descubriendo rumbos logo-Photoroom.png"
            alt=""
            className="logo-img"
          />
        </button>
      </div>

      {seccionActual && (
        <nav className="migas-pan" aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">&gt;</span>
          <span aria-current="page">{seccionActual}</span>
        </nav>
      )}

      { esHome &&
        <div id="barra-busqueda">
          <form onSubmit={buscar}>
            <input
              type="text"
              name="termino"
              placeholder="Buscar por destino, tipo de viaje o proveedor…"
              defaultValue={searchParams.get('buscar') || ''}
            />
            <input type="submit" value="Buscar" />
          </form>
        </div>
      }
    </header>
  )
}

export default App;
