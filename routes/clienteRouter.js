const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rutas
router.post('/registro', clienteController.registrarCliente);

router.post('/login', clienteController.iniciarSesion);

module.exports = router;
