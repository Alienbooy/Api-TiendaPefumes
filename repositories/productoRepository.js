const pool = require('../db'); 

const insertarProducto = async (tipo, stock, precio) => {
    const query = `
        INSERT INTO producto (tipo, stock, precio)
        VALUES ($1, $2, $3)
        RETURNING id_producto;
    `;
    const values = [tipo, stock, precio];
    const result = await pool.query(query, values);
    return result.rows[0].id_producto; 
};

const insertarPerfume = async (id_producto, marca, nombre, descripcion, ml, image_url) => {
    const query = `
        INSERT INTO perfume (id_producto, marca, nombre, descripcion, ml, image_url)
        VALUES ($1, $2, $3, $4, $5, $6);
    `;
    const values = [id_producto, marca, nombre, descripcion, ml, image_url];
    await pool.query(query, values);
};

const insertarCombo = async (id_producto, nombre, descripcion, image_url) => {
    const query = `
        INSERT INTO combo (id_producto, nombre, descripcion, image_url)
        VALUES ($1, $2, $3, $4);
    `;
    const values = [id_producto, nombre, descripcion, image_url];
    await pool.query(query, values);
};

const obtenerPerfumesPorMarca = async (marca) => {
    const query = `
        SELECT p.id_producto, p.tipo, p.stock, p.precio, pf.marca, pf.nombre, pf.descripcion, pf.ml, pf.image_url 
        FROM producto p
        INNER JOIN perfume pf ON p.id_producto = pf.id_producto
        WHERE pf.marca = $1;
    `;
    const values = [marca];
    const { rows } = await pool.query(query, values);
    return rows.length > 0 ? rows : []; 
};

module.exports = {
    insertarProducto,
    insertarPerfume,
    insertarCombo,
    obtenerPerfumesPorMarca, 
};
