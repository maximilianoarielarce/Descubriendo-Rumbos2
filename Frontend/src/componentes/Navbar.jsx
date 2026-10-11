import { Link } from "react-router-dom";

export default function Navbar({ mostrarAccesoAdmin }) {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link
            to="/"
            id="inicio"
            onClick={() => window.dispatchEvent(new CustomEvent('descubriendo:inicio'))}
          >
            <i className="fa-solid fa-plane"></i> Inicio
          </Link>
        </li>

        <li>
          <Link to="/carrito" id="carrito">
            <i className="fa-solid fa-cart-shopping"></i> Carrito
          </Link>
        </li>

        {mostrarAccesoAdmin && (
          <li className="navbar-item-admin">
            <Link to="/login" id="login" title="Acceso administrador" aria-label="Acceso administrador">
              <i className="fa-solid fa-lock"></i>
            </Link>
          </li>
        )}
      </ul>

    </nav>
  );
}
