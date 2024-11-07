const pool = require('../db'); 

// Registrar un nuevo cliente
exports.registrarCliente = async (req, res) => {
    const { nombre, email, password, telefono, direccion } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO Cliente (nombre, email, password, telefono, direccion) VALUES ($1, $2, $3, $4, $5) RETURNING id_cliente',
            [nombre, email, password, telefono, direccion]
        );
        res.status(201).json({ message: 'Cliente registrado exitosamente', id_cliente: result.rows[0].id_cliente });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar cliente', error: error.message });
    }
};


exports.obtenerCliente = async (req, res) => {
    const { id_cliente } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Cliente WHERE id_cliente = $1', [id_cliente]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
    }
};

exports.eliminarCliente = async (req, res) => {
    const { id_cliente } = req.params;

    try {
        // Eliminar el cliente por su id_cliente
        const result = await pool.query(
            'DELETE FROM Cliente WHERE id_cliente = $1 RETURNING *',
            [id_cliente]
        );

        // Verificar si el cliente existía
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json({ message: 'Cliente eliminado exitosamente', cliente: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el cliente', error: error.message });
    }
};
