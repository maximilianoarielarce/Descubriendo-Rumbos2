import './ObtenerFoto.css'

import { enviarArchivoImagen } from '../../servicios/upload'
import { useState } from 'react'


export function ObtenerFoto(props) {
    const { escribirCampoFoto } = props

    const [porcentaje, setPorcentaje] = useState(0)
    const [urlFoto, setUrlFoto] = useState('')

    const enviarFoto = archivo => {

        if(archivo.type.includes('image/')) {
            const formdata = new FormData()
            formdata.append('archivo', archivo)
            enviarArchivoImagen(formdata, porcentaje => {
                setPorcentaje(porcentaje)
            }, urlFoto => {
                setUrlFoto(urlFoto)
                if(typeof escribirCampoFoto == 'function') escribirCampoFoto(urlFoto)
            })
        }
        else console.error('El archivo elegido no corresponde a una imágen')        
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
                    { porcentaje > 0
                        ? ( urlFoto? <img src={urlFoto} alt="" /> : <></> )
                        : 'D&D or Click'
                    }
                </label>
            </div>
        </div>
    )
}