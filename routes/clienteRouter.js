const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');


router.post('/registro', clienteController.registrarCliente);
router.get('/:id_cliente', clienteController.obtenerCliente);
router.delete('/:id_cliente', clienteController.eliminarCliente);

module.exports = router;
