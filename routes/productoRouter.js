const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');



router.post('/crear-perfume', productoController.crearPerfume); 
router.post('/crear-combo', productoController.crearCombo);
router.get('/perfumes', productoController.obtenerPerfumes);

module.exports = router;
