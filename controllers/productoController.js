const pool = require('../db');


exports.listarProductos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Producto');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};