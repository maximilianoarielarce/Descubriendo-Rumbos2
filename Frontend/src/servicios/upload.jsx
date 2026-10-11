import { API_URL } from "./apiConfig.jsx";

const url = `${API_URL}/api/upload/`

export const enviarArchivoImagen = (formdata, cbProgress, cbUrlFoto, cbError) => {
    const token = localStorage.getItem('authToken')

    if(!token) {
        if(typeof cbError == 'function') cbError('Iniciá sesión como administrador para subir imágenes.')
        return
    }

    const xhr = new XMLHttpRequest()
    xhr.open('post', url)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.addEventListener('load', () => {
        let respuesta
        try {
            respuesta = JSON.parse(xhr.responseText)
        } catch {
            respuesta = {}
        }

        if(xhr.status >= 200 && xhr.status < 300 && respuesta.urlFoto) {
            if(typeof cbUrlFoto == 'function') cbUrlFoto(respuesta.urlFoto)
            return
        }

        const mensaje = respuesta.error || `No se pudo subir la imagen (HTTP ${xhr.status}).`
        if(typeof cbError == 'function') cbError(mensaje)
    })
    xhr.addEventListener('error', () => {
        if(typeof cbError == 'function') cbError('No se pudo conectar con el servidor para subir la imagen.')
    })
    xhr.upload.addEventListener('progress', e => {
        if(e.lengthComputable) {
            const porcentaje = parseInt((e.loaded * 100) / e.total)
            if(typeof cbProgress == 'function') cbProgress(porcentaje)
        }
    })
    xhr.send(formdata)
}