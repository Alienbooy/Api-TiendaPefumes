const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/crear', pedidoController.crearPedido);
router.get('/cliente/:id_cliente', pedidoController.verPedidosCliente);

module.exports = router;
