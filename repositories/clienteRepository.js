const pool = require('../db');

const crearCliente = async (nombre, email, password, telefono, direccion) => {
    const query = `
        INSERT INTO Cliente (nombre, email, password, telefono, direccion) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id_cliente
    `;
    const values = [nombre, email, password, telefono, direccion];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const obtenerClientePorId = async (id_cliente) => {
    const query = 'SELECT * FROM Cliente WHERE id_cliente = $1';
    const result = await pool.query(query, [id_cliente]);
    return result.rows[0];
};

const eliminarCliente = async (id_cliente) => {
    const query = 'DELETE FROM Cliente WHERE id_cliente = $1 RETURNING *';
    const result = await pool.query(query, [id_cliente]);
    return result.rows[0];
};

module.exports = {
    crearCliente,
    obtenerClientePorId,
    eliminarCliente,
};
