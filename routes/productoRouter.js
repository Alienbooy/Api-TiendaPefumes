const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');



router.post('/crear-perfume', productoController.crearPerfume); 
router.post('/crear-combo', productoController.crearCombo);
router.get('/combos', productoController.obtenerCombos);
router.get('/perfumes/marca', productoController.obtenerPerfumesPorMarca);



module.exports = router;
