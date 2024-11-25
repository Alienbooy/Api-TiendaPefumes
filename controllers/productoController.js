const pool = require('../db'); 
const productoRepository = require('../repositories/productoRepository'); 



const obtenerCombos = async (req, res) => {
    try {
        const query = `
            SELECT c.id_producto, c.nombre, c.descripcion, c.image_url, p.precio::float AS precio, p.stock
            FROM producto p
            INNER JOIN combo c ON p.id_producto = c.id_producto
            WHERE p.tipo = 'Combo';
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener combos:', error);
        res.status(500).json({ message: 'Error al obtener combos', error: error.message });
    }
};

const obtenerPerfumesPorMarca = async (req, res) => {
    try {
        const { marca } = req.query; 
        const query = `
            SELECT p.id_producto, pf.nombre, pf.marca, pf.ml, pf.image_url, p.precio::float AS precio, p.stock
            FROM producto p
            INNER JOIN perfume pf ON p.id_producto = pf.id_producto
            WHERE pf.marca = $1; 
        `;
        const values = [marca]; 
        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error al obtener perfumes por marca:", error);
        res.status(500).json({ error: "Error al obtener perfumes por marca" });
    }
};


const crearPerfume = async (req, res) => {
    const { stock, precio, marca, nombre, descripcion, ml, image_url } = req.body;

    try {
        const id_producto = await productoRepository.insertarProducto('Perfume', stock, precio);
        await productoRepository.insertarPerfume(id_producto, marca, nombre, descripcion, ml, image_url);

        res.status(201).json({ message: 'Perfume creado exitosamente', id_producto });
    } catch (error) {
        console.error('Error al crear perfume:', error);
        res.status(500).json({ message: 'Error al crear perfume', error: error.message });
    }
};

const crearCombo = async (req, res) => {
    const { stock, precio, nombre, descripcion, image_url } = req.body;

    try {
        const id_producto = await productoRepository.insertarProducto('Combo', stock, precio);
        await productoRepository.insertarCombo(id_producto, nombre, descripcion, image_url);

        res.status(201).json({ message: 'Combo creado exitosamente', id_producto });
    } catch (error) {
        console.error('Error al crear combo:', error);
        res.status(500).json({ message: 'Error al crear combo', error: error.message });
    }
};

module.exports = {
    obtenerCombos,
    obtenerPerfumesPorMarca,
    crearPerfume,
    crearCombo,
};
