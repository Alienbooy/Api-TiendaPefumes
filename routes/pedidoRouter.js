const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const verificarToken = require('../middlewares/verificaToken');

router.post('/crear', verificarToken, pedidoController.crearPedido);

router.get('/cliente/:id_cliente', verificarToken, pedidoController.verPedidosCliente);

module.exports = router;
