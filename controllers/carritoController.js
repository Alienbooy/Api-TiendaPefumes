const pool = require("../db");

exports.agregarAlCarrito = async (req, res) => {
    console.log("Iniciando agregar al carrito");
    const { id_producto, cantidad } = req.body;
    const id_cliente = req.id_cliente;

    if (!id_cliente || !id_producto || !cantidad) {
        return res.status(400).json({ message: "Datos insuficientes para agregar al carrito." });
    }

    try {
        console.log("Verificando existencia del producto:", { id_producto });
        const producto = await pool.query("SELECT stock FROM Producto WHERE id_producto = $1", [id_producto]);

        if (producto.rows.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado." });
        }

        if (producto.rows[0].stock < cantidad) {
            return res.status(400).json({ message: "Stock insuficiente." });
        }

        console.log("Verificando si el cliente ya tiene un carrito");
        const carritoExistente = await pool.query(
            "SELECT id_carrito FROM Carrito WHERE id_cliente = $1",
            [id_cliente]
        );

        let id_carrito;
        if (carritoExistente.rows.length > 0) {
            id_carrito = carritoExistente.rows[0].id_carrito;
        } else {
            console.log("Creando un nuevo carrito para el cliente");
            const nuevoCarrito = await pool.query(
                "INSERT INTO Carrito (id_cliente) VALUES ($1) RETURNING id_carrito",
                [id_cliente]
            );
            id_carrito = nuevoCarrito.rows[0].id_carrito;
        }

        console.log("Insertando producto en el carrito:", { id_carrito, id_producto, cantidad });
        await pool.query(
            `INSERT INTO Carrito_Producto (id_carrito, id_producto, cantidad)
             VALUES ($1, $2, $3)
             ON CONFLICT (id_carrito, id_producto) DO UPDATE 
             SET cantidad = Carrito_Producto.cantidad + EXCLUDED.cantidad`,
            [id_carrito, id_producto, cantidad]
        );

        console.log("Producto agregado exitosamente");
        res.status(200).json({ message: "Producto agregado al carrito." });
    } catch (error) {
        console.error("Error al agregar al carrito:", error);
        res.status(500).json({ message: "Error al agregar al carrito.", error: error.message });
    }
};


exports.verCarritoCliente = async (req, res) => {
    const id_cliente = req.id_cliente;

    try {
        console.log(`Iniciando consulta del carrito para el cliente: ${id_cliente}`);
        const carrito = await pool.query(
            `SELECT 
                COALESCE(co.nombre, pe.nombre) AS nombre, 
                p.precio, 
                cp.cantidad
             FROM 
                Carrito_Producto cp
             JOIN 
                Producto p ON cp.id_producto = p.id_producto
             LEFT JOIN 
                Combo co ON co.id_producto = p.id_producto
             LEFT JOIN 
                Perfume pe ON pe.id_producto = p.id_producto
             JOIN 
                Carrito c ON c.id_carrito = cp.id_carrito
             WHERE 
                c.id_cliente = $1`,
            [id_cliente]
        );

        if (carrito.rows.length === 0) {
            return res.status(404).json({ message: 'El carrito está vacío o no existe para este cliente.' });
        }

        console.log("Datos del carrito obtenidos:", carrito.rows);
        res.status(200).json(carrito.rows);
    } catch (error) {
        console.error("Error al obtener el carrito del cliente:", error);
        res.status(500).json({ message: 'Error al obtener el carrito del cliente.', error: error.message });
    }
};
