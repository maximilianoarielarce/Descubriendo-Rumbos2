import { ProductosModel } from "../model/DAOs/productos/ProductosModel.js";
export const getProductos = async (req, res) => {
    console.log("GET productos: entró");

    try {
        console.log("GET productos: consultando MongoDB");
        const productos = await ProductosModel.findAll();
        console.log("GET productos: resultado", productos.length);

        return res.json(productos);
    } catch (error) {
        console.error("GET productos: error", error);
        return res.status(500).json({ error: error.message });
    }
};

/* export const getProductos = async (req, res) => {
    const productos = await ProductosModel.findAll();
    res.json(productos);
}; */

export const getProducto = async (req, res) => {
    const id = req.params.id;
    const producto = await ProductosModel.findById(id);
    res.json(producto);
};

export const crearProducto = async (req, res) => {
    const data = req.body;
    const nuevo = await ProductosModel.create(data);
    res.json(nuevo);
};

export const actualizarProducto = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const actualizado = await ProductosModel.update(id, data);
    res.json(actualizado);
};

export const eliminarProducto = async (req, res) => {
    const id = req.params.id;
    const eliminado = await ProductosModel.remove(id);
    res.json(eliminado);
};
