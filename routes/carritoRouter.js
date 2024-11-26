const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const verificarToken = require('../middlewares/verificaToken');

router.post('/agregar', verificarToken, carritoController.agregarAlCarrito);

router.get('/cliente', verificarToken, carritoController.verCarritoCliente);


module.exports = router;
