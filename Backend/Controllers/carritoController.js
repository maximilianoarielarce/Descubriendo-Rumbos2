export const recibirCarrito = (req, res) => {
    console.log("Carrito recibido:", req.body);
    res.json({ mensaje: "Carrito recibido correctamente ✔" });
};
