import axios from "axios";
import { API_URL } from "./apiConfig.jsx";

console.log('MODO:', import.meta.env.MODE)

const url = `${API_URL}/api/productos/`


//https://refactoring.guru/es/design-patterns/proxy
//https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Proxy


export const proxyProducto = producto => {
  const handler = {
    get(target, prop) {
      if(prop === 'id') prop = '_id'
      return target[prop]
    }
  }
  
  return new Proxy(producto, handler)
}


const eliminarPropiedad = (obj, prop) => {
  const objClon = { ...obj }
  delete objClon[prop]
  return objClon
}

// las operaciones de escritura requieren el token del administrador logueado
const authHeaders = () => {
  const token = localStorage.getItem('authToken')
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
}

const getAll = async () => (await axios.get(url)).data.map(producto => proxyProducto(producto));

const guardar = async prod => proxyProducto((await axios.post(url, prod, authHeaders())).data)

const actualizar = async (id, prod) => proxyProducto((await axios.put(url + id, eliminarPropiedad(prod,'_id'), authHeaders())).data)

const eliminar = async id => proxyProducto((await axios.delete(url + id, authHeaders())).data)


/* ------------------------------------------ */
/*                exportación                 */
/* ------------------------------------------ */
export default {
    getAll,
    guardar,
    actualizar,
    eliminar
}