const pool = require('../db');

const obtenerCarritoPorCliente = async (id_cliente) => {
    const query = `
        SELECT c.id_carrito, cp.id_producto, p.nombre, p.precio, cp.cantidad
        FROM Carrito c
        JOIN Carrito_Producto cp ON c.id_carrito = cp.id_carrito
        JOIN Producto p ON cp.id_producto = p.id_producto
        WHERE c.id_cliente = $1
    `;
    const result = await pool.query(query, [id_cliente]);
    return result.rows;
};

const crearCarrito = async (id_cliente) => {
    const query = `
        INSERT INTO Carrito (id_cliente) 
        VALUES ($1) 
        RETURNING id_carrito
    `;
    const result = await pool.query(query, [id_cliente]);
    return result.rows[0];
};

const agregarProductoAlCarrito = async (id_carrito, id_producto, cantidad) => {
    const query = `
        INSERT INTO Carrito_Producto (id_carrito, id_producto, cantidad) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (id_carrito, id_producto) DO UPDATE 
        SET cantidad = Carrito_Producto.cantidad + EXCLUDED.cantidad
    `;
    await pool.query(query, [id_carrito, id_producto, cantidad]);
};

module.exports = {
    obtenerCarritoPorCliente,
    crearCarrito,
    agregarProductoAlCarrito,
};
