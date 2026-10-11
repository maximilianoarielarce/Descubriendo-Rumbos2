import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-columna">
          <h4>Descubriendo rumbos</h4>
          <ul>
            <li><Link to="/nosotros" id="nosotros">Nosotros</Link></li>
          </ul>
          <p>Maria Soledad de la Lama</p>
          <p>Legajo N° 12.136</p>
        </div>

        <div className="footer-columna">
          <h4>Soporte</h4>
          <ul>
            <li> <Link to ="/preguntasfrecuentes" id="preguntas frecuentes">Preguntas frecuentes</Link></li>
            <li> <Link to ="/contacto" id="contacto">Contacto</Link></li>
            <li><Link to ="/politicaprivacidad">Política de privacidad</Link></li>

            <li><Link to ="/terminoscondiciones">Terminos y Condiciones</Link></li>
          </ul>
        </div>

        <div className="footer-columna">
          <h4>Seguinos</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/descubriendorumbos/"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://www.facebook.com/descubriendorumbosOK"><i className="fa-brands fa-facebook"></i></a>
          </div>
          <p>Copyright © 2025 Descubriendo rumbos. Todos los derechos reservados.</p>
        </div>

        <div className="footer-columna">
          <h4>Legales</h4>
          <div className="footer-legal">
            <span>
              Defensa de las y los consumidores. Para reclamos
              <a href="https://buenosaires.gob.ar/gobierno/atencion-ciudadana/defensa-al-consumidor"> ingrese aquí</a>.
            </span>
            <br /><br />
            <span>
              ¿Querés denunciar una agencia? 👉
              <a href="https://tramitesadistancia.gob.ar/tramitesadistancia/detalle-tipo?id=624" target="_blank">
                Iniciar denuncia en TAD
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
