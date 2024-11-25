const pool = require('../db'); 

const { insertarProducto, insertarPerfume, insertarCombo } = require('../repositories/productoRepository');

const obtenerPerfumes = async (req, res) => {
    try {
        const query = `
            SELECT p.id_producto, pf.nombre, pf.marca, pf.ml, pf.image_url, p.precio::float AS precio, p.stock
            FROM producto p
            INNER JOIN perfume pf ON p.id_producto = pf.id_producto
            WHERE p.tipo = 'Perfume';
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en obtenerPerfumes:', error);
        res.status(500).json({ message: 'Error al obtener perfumes', error: error.message });
    }
};




const crearPerfume = async (req, res) => {
    const { stock, precio, marca, nombre, descripcion, ml, image_url } = req.body;

    try {
        const id_producto = await insertarProducto('Perfume', stock, precio);
        await insertarPerfume(id_producto, marca, nombre, descripcion, ml, image_url);

        res.status(201).json({ message: 'Perfume creado exitosamente', id_producto });
    } catch (error) {
        console.error('Error al crear perfume:', error);
        res.status(500).json({ message: 'Error al crear perfume', error: error.message });
    }
};


const crearCombo = async (req, res) => {
    const { stock, precio, nombre, descripcion, image_url } = req.body;

    try {
        const id_producto = await insertarProducto('Combo', stock, precio);
        await insertarCombo(id_producto, nombre, descripcion, image_url);

        res.status(201).json({ message: 'Combo creado exitosamente', id_producto });
    } catch (error) {
        console.error('Error al crear combo:', error);
        res.status(500).json({ message: 'Error al crear combo', error: error.message });
    }
};

module.exports = {
    crearPerfume,
    crearCombo,
    obtenerPerfumes 
};
