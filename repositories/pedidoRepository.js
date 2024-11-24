const pool = require('../db');

const crearVenta = async (id_cliente, total) => {
    const query = `
        INSERT INTO NotaDeVenta (id_cliente, fecha_venta, total) 
        VALUES ($1, CURRENT_TIMESTAMP, $2) 
        RETURNING id_venta
    `;
    const result = await pool.query(query, [id_cliente, total]);
    return result.rows[0];
};

const agregarProductoAVenta = async (id_venta, id_producto, cantidad, precio_unitario) => {
    const query = `
        INSERT INTO Venta_Producto (id_venta, id_producto, cantidad, precio_unitario) 
        VALUES ($1, $2, $3, $4)
    `;
    await pool.query(query, [id_venta, id_producto, cantidad, precio_unitario]);
};

const obtenerPedidosPorCliente = async (id_cliente) => {
    const query = `
        SELECT nv.id_venta, nv.fecha_venta, nv.total, p.nombre AS producto, vp.cantidad, vp.precio_unitario
        FROM NotaDeVenta nv
        JOIN Venta_Producto vp ON nv.id_venta = vp.id_venta
        JOIN Producto p ON vp.id_producto = p.id_producto
        WHERE nv.id_cliente = $1
        ORDER BY nv.fecha_venta DESC
    `;
    const result = await pool.query(query, [id_cliente]);
    return result.rows;
};

module.exports = {
    crearVenta,
    agregarProductoAVenta,
    obtenerPedidosPorCliente,
};
