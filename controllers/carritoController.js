const pool = require('../db');

exports.agregarAlCarrito = async (req, res) => {
    const { id_cliente, id_producto, cantidad } = req.body;
    try {
        // Verifica si el carrito ya existe para el cliente
        let id_carrito;
        const carritoExistente = await pool.query(
            'SELECT id_carrito FROM Carrito WHERE id_cliente = $1',
            [id_cliente]
        );

        if (carritoExistente.rows.length > 0) {
            // Si existe, obtén el id_carrito
            id_carrito = carritoExistente.rows[0].id_carrito;
        } else {
            // Si no existe, crea un nuevo carrito
            const nuevoCarrito = await pool.query(
                `INSERT INTO Carrito (id_cliente) VALUES ($1) 
                 RETURNING id_carrito`,
                [id_cliente]
            );
            id_carrito = nuevoCarrito.rows[0].id_carrito;
        }

        // Insertar el producto en Carrito_Producto con manejo de conflicto
        await pool.query(
            `INSERT INTO Carrito_Producto (id_carrito, id_producto, cantidad) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (id_carrito, id_producto) DO UPDATE 
             SET cantidad = Carrito_Producto.cantidad + EXCLUDED.cantidad`,
            [id_carrito, id_producto, cantidad]
        );

        res.status(200).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error(error); // Imprime el error en la consola para más detalles
        res.status(500).json({ message: 'Error al agregar al carrito', error: error.message });
    }
};

exports.verCarritoCliente = async (req, res) => {
    const { id_cliente } = req.params;

    try {
        const carrito = await pool.query(
            `SELECT p.nombre, p.precio, cp.cantidad
             FROM Carrito_Producto cp
             JOIN Producto p ON cp.id_producto = p.id_producto
             JOIN Carrito c ON c.id_carrito = cp.id_carrito
             WHERE c.id_cliente = $1`,
            [id_cliente]
        );

        if (carrito.rows.length === 0) {
            return res.status(404).json({ message: 'El carrito está vacío o no existe para este cliente' });
        }

        res.status(200).json(carrito.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el carrito del cliente', error: error.message });
    }
};
