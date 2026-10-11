import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import './Index.css'
import servicioAuth from '../../servicios/auth.jsx'

export function Index() {
    const [usuario, setUsuario] = useState('')
    const [clave, setClave] = useState('')
    const [error, setError] = useState('')
    const [enviando, setEnviando] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    // si venía de intentar entrar a una ruta protegida, vuelve para allá
    const destino = location.state?.from || '/alta'

    async function enviar(e) {
        e.preventDefault()
        setError('')
        setEnviando(true)

        try {
            await servicioAuth.login(usuario, clave)
            navigate(destino, { replace: true })
        } catch (err) {
            console.error('Error de login', err)
            setError(
                err.response?.status === 401
                    ? 'Usuario o clave incorrectos'
                    : 'No se pudo conectar con el servidor. Intentá nuevamente.'
            )
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="login">
            <form className="login-card" onSubmit={enviar}>
                <span className="login-eyebrow">Acceso administrador</span>
                <h1>Descubriendo Rumbos</h1>
                <p className="login-subtitle">Ingresá tus credenciales para gestionar los paquetes.</p>

                <div className="login-input-group">
                    <label htmlFor="usuario">Usuario</label>
                    <input
                        id="usuario"
                        type="text"
                        autoComplete="username"
                        value={usuario}
                        onChange={e => setUsuario(e.target.value)}
                        required
                    />
                </div>

                <div className="login-input-group">
                    <label htmlFor="clave">Contraseña</label>
                    <input
                        id="clave"
                        type="password"
                        autoComplete="current-password"
                        value={clave}
                        onChange={e => setClave(e.target.value)}
                        required
                    />
                </div>

                { error && <p className="login-error">{error}</p> }

                <button type="submit" disabled={enviando}>
                    { enviando ? 'Ingresando…' : 'Ingresar' }
                </button>
            </form>
        </div>
    )
}
