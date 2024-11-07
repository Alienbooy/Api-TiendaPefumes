const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

router.post('/agregar', carritoController.agregarAlCarrito);
router.get('/cliente/:id_cliente', carritoController.verCarritoCliente);

module.exports = router;
