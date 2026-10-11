import { useState } from "react"
import { proxyProducto } from "../servicios/productos"

// Hook personalizado para guardar estado local en localStorage
export function useStateLocalStorage(key, inicial) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key)
            return item? JSON.parse(item).map(producto => proxyProducto(producto)) : inicial
        }
        catch(error) {
            console.error('ERROR useStateLocalStorage (inicial)', error)
            return inicial
        }
    })

    const setValue = value => {
        try {
            setStoredValue(value)
            localStorage.setItem(key, JSON.stringify(value))
        }
        catch(error) {
            console.error('ERROR useStateLocalStorage (setValue)', error)
        }
    }

    return [storedValue, setValue]
}