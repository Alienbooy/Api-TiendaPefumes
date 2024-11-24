const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.registrarCliente = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        // Validar si el email ya existe
        const emailExistente = await pool.query('SELECT id_cliente FROM cliente WHERE email = $1', [email]);
        if (emailExistente.rows.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado.' });
        }

        // Cifrar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo cliente
        const nuevoCliente = await pool.query(
            'INSERT INTO cliente (nombre, email, password) VALUES ($1, $2, $3) RETURNING id_cliente',
            [nombre, email, hashedPassword]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente.', id_cliente: nuevoCliente.rows[0].id_cliente });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar cliente.', error: error.message });
    }
};

exports.iniciarSesion = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar cliente por email
        const cliente = await pool.query('SELECT id_cliente, password FROM cliente WHERE email = $1', [email]);

        if (cliente.rows.length === 0) {
            return res.status(404).json({ message: 'Credenciales incorrectas.' });
        }

        // Verificar contraseña
        const contrasenaValida = await bcrypt.compare(password, cliente.rows[0].password);
        if (!contrasenaValida) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        // Generar token JWT
        const token = jwt.sign({ id_cliente: cliente.rows[0].id_cliente }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión.', error: error.message });
    }
};


