import './ObtenerFoto.css'

import { enviarArchivoImagen } from '../../servicios/upload'
import { useState } from 'react'


export function ObtenerFoto(props) {
    const { escribirCampoFoto } = props

    const [porcentaje, setPorcentaje] = useState(0)
    const [urlFoto, setUrlFoto] = useState('')
    const [error, setError] = useState('')

    const enviarFoto = archivo => {
        if(!archivo) return

        setError('')
        setPorcentaje(0)

        if(archivo.type.startsWith('image/')) {
            const formdata = new FormData()
            formdata.append('archivo', archivo)
            enviarArchivoImagen(formdata, porcentaje => {
                setPorcentaje(porcentaje)
            }, urlFoto => {
                setUrlFoto(urlFoto)
                if(typeof escribirCampoFoto == 'function') escribirCampoFoto(urlFoto)
            }, mensaje => {
                setError(mensaje)
                setPorcentaje(0)
            })
        }
        else setError('El archivo elegido no es una imagen.')
    }

    const dragEnter = e => {
        console.log('dragEnter')
        e.preventDefault()
    }

    const dragLeave = e => {
        console.log('dragLeave')
        e.preventDefault()
    }

    const dragOver = e => {
        console.log('dragOver')
        e.preventDefault()
    }

    const drop = e => {
        //console.log('drop')
        e.preventDefault()

        /* console.log('drop')
        console.dir(e) */
        const archivo = e.dataTransfer.files[0]
        //console.log('drop', archivo)
        enviarFoto(archivo)
    }

    const change = e => {
        //console.log('input change')
        /* console.log('change')
        console.dir(e) */
        const archivo = e.target.files[0]
        //console.log('change', archivo)
        enviarFoto(archivo)
    }

    return (
        <div className="ObtenerFoto">
            <input type="file" id="archivo" onChange={change} />
            <div 
                id="drop"
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDragOver={dragOver}
                onDrop={drop}
            >
                { porcentaje > 0 && <><progress max="100" value={porcentaje}></progress> <span>{porcentaje}%</span></> }
                <label htmlFor="archivo">
                    { urlFoto
                        ? <img src={urlFoto} alt="Vista previa de la imagen seleccionada" />
                        : porcentaje > 0 ? 'Subiendo imagen...' : 'Arrastrá una imagen o hacé clic'
                    }
                </label>
                { error && <p className="error-upload">{error}</p> }
            </div>
        </div>
    )
}