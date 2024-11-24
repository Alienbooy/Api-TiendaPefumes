const pool = require('../db');

const listarProductos = async () => {
    const query = 'SELECT * FROM Producto';
    const result = await pool.query(query);
    return result.rows;
};

const obtenerProductoPorId = async (id_producto) => {
    const query = 'SELECT * FROM Producto WHERE id_producto = $1';
    const result = await pool.query(query, [id_producto]);
    return result.rows[0];
};

module.exports = {
    listarProductos,
    obtenerProductoPorId,
};
