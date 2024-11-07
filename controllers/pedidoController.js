const pool = require('../db');

exports.crearPedido = async (req, res) => {
    const { id_cliente, productos } = req.body;
    
    try {

        if (!productos || productos.length < 2) {
            return res.status(400).json({ message: 'El pedido debe incluir al menos dos productos.' });
        }

        let total = 0;
        for (let item of productos) {
            const producto = await pool.query(
                'SELECT precio FROM Producto WHERE id_producto = $1',
                [item.id_producto]
            );
            if (producto.rows.length === 0) {
                return res.status(404).json({ message: `Producto con id ${item.id_producto} no encontrado` });
            }
            total += producto.rows[0].precio * item.cantidad;
        }

        const nuevaVenta = await pool.query(
            `INSERT INTO NotaDeVenta (id_cliente, fecha_venta, total) 
             VALUES ($1, CURRENT_TIMESTAMP, $2) 
             RETURNING id_venta`,
            [id_cliente, total]
        );
        const id_venta = nuevaVenta.rows[0].id_venta;

        for (let item of productos) {
            const producto = await pool.query(
                'SELECT precio FROM Producto WHERE id_producto = $1',
                [item.id_producto]
            );

            await pool.query(
                `INSERT INTO Venta_Producto (id_venta, id_producto, cantidad, precio_unitario)
                 VALUES ($1, $2, $3, $4)`,
                [id_venta, item.id_producto, item.cantidad, producto.rows[0].precio]
            );
        }

        res.status(201).json({ message: 'Pedido creado exitosamente', id_venta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el pedido', error: error.message });
    }
};

exports.verPedidosCliente = async (req, res) => {
    const { id_cliente } = req.params;

    try {
        const pedidos = await pool.query(
            `SELECT nv.id_venta, nv.fecha_venta, nv.total, p.nombre AS producto, vp.cantidad, vp.precio_unitario
             FROM NotaDeVenta nv
             JOIN Venta_Producto vp ON nv.id_venta = vp.id_venta
             JOIN Producto p ON vp.id_producto = p.id_producto
             WHERE nv.id_cliente = $1
             ORDER BY nv.fecha_venta DESC`,
            [id_cliente]
        );

        if (pedidos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pedidos para este cliente' });
        }

        res.status(200).json(pedidos.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los pedidos del cliente', error: error.message });
    }
};