import { Navigate, useLocation } from 'react-router'
import servicioAuth from '../servicios/auth.jsx'

/**
 * Envuelve una ruta que sólo el administrador debe poder ver
 * (ej. /alta). Si no hay sesión válida, redirige a /login.
 */
export function RutaProtegida({ children }) {
    const location = useLocation()

    if (!servicioAuth.estaAutenticado()) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }

    return children
}
