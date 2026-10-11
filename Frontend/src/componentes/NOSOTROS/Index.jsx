

import { useEffect } from "react";
import './Index.css';

const Nosotros = () => {
/* 
  useEffect(() => {
    moduloNosotros.start(); // Ejecuta tu JS original adaptado
  }, []); */

  return (
    <div className="nosotros">
      <div className="contenedor">
      <h1>Quienes somos nosotros?</h1>

            <br/>

            <p>Descubriendo Rumbos EVT: Tu viaje hacia una experiencia consciente.</p>

            <br/>

            <p>Desde 2004, en Buenos Aires, Descubriendo Rumbos EVT ha sido el punto de partida para innumerables
                aventuras. Nacimos con la misión de diseñar viajes a medida, además de ofrecer una completa oferta de
                pasajes aéreos, terrestres y fluviales.</p>

            <br/>

            <p>Con el paso del tiempo, evolucionamos para crear nuestros propios paquetes, con salidas especialmente
                pensadas para nuestra comunidad local. Hoy, damos un paso más allá, enfocándonos en salidas cortas que
                rompen con la rutina. Incorporamos los principios del mindfulness y el enfoque en la experiencia para
                que cada viaje sea una oportunidad de reconectar, tanto con el destino como contigo mismo.</p>

            <br/>

            <p>En Descubriendo Rumbos, no solo vendemos viajes, creamos experiencias que nutren el alma.</p>

      </div>
    </div>



  );
};

export default Nosotros;
