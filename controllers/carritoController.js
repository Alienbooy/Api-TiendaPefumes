const pool = require("../db");

exports.agregarAlCarrito = async (req, res) => {
    console.log("estoy en agregar al carrito");
    const { id_producto, cantidad } = req.body;
    const id_cliente = req.id_cliente; 

    if (!id_cliente || !id_producto || !cantidad) {
        return res.status(400).json({ message: "Datos insuficientes para agregar al carrito." });
    }

    try {
        const producto = await pool.query(
            "SELECT stock FROM Producto WHERE id_producto = $1",
            [id_producto]
        );

        if (producto.rows.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado." });
        }

        if (producto.rows[0].stock < cantidad) {
            return res.status(400).json({ message: "Stock insuficiente." });
        }

        let id_carrito;
        const carritoExistente = await pool.query(
            "SELECT id_carrito FROM Carrito WHERE id_cliente = $1",
            [id_cliente]
        );

        if (carritoExistente.rows.length > 0) {
            id_carrito = carritoExistente.rows[0].id_carrito;
        } else {
            const nuevoCarrito = await pool.query(
                `INSERT INTO Carrito (id_cliente) VALUES ($1) RETURNING id_carrito`,
                [id_cliente]
            );
            id_carrito = nuevoCarrito.rows[0].id_carrito;
        }
        console.log("estoy por añadir algo al carrito");
        await pool.query(
            `INSERT INTO Carrito_Producto (id_carrito, id_producto, cantidad)
             VALUES ($1, $2, $3)
             ON CONFLICT (id_carrito, id_producto) DO UPDATE 
             SET cantidad = Carrito_Producto.cantidad + EXCLUDED.cantidad`,
            [id_carrito, id_producto, cantidad]
        );

        res.status(200).json({ message: "Producto agregado al carrito." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al agregar al carrito.", error: error.message });
    }
};

exports.verCarritoCliente = async (req, res) => {
    const id_cliente = req.id_cliente;

    try {
        const carrito = await pool.query(
            `SELECT p.id_producto, p.nombre, p.precio, cp.cantidad
             FROM Carrito_Producto cp
             JOIN Producto p ON cp.id_producto = p.id_producto
             JOIN Carrito c ON cp.id_carrito = c.id_carrito
             WHERE c.id_cliente = $1`,
            [id_cliente]
        );

        if (carrito.rows.length === 0) {
            return res.status(404).json({ message: "El carrito está vacío o no existe para este cliente." });
        }

        res.status(200).json(carrito.rows);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ message: "Error al obtener el carrito.", error: error.message });
    }
};




