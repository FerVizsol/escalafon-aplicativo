const express = require('express');
const router = express.Router();
const customerControllers = require('../controllers/customerControllers');
const controller = require('../controllers/customerControllers');


router.get('/', customerControllers.inicio);
router.get('/busqueda', customerControllers.busqueda)
router.get('/legajo/:id', customerControllers.verlegajo)
router.get('/anadir', customerControllers.anadirdocente)
router.get('/editar/:id', customerControllers.editardocente)
router.get('/eliminar/:id', customerControllers.eliminardocente)
router.get('/delete/:id', customerControllers.delete)
router.get('/nuevaresolucion/:id', customerControllers.nuevaresolucion)
router.get('/seccion2/:id',customerControllers.seccion2)
router.get('/seccion3/:id',customerControllers.seccion3)
router.get('/seccion4/:id',customerControllers.seccion4)
router.get('/seccion5/:id',customerControllers.seccion5)
router.get('/seccion6/:id',customerControllers.seccion6)
router.get('/seccion7/:id',customerControllers.seccion7)
router.get('/seccion8/:id',customerControllers.seccion8)
router.get('/seccion9/:id',customerControllers.seccion9)
router.get('/seccion10/:id',customerControllers.seccion10)
router.post('/anadir2/:id', customerControllers.anadirdocente2)

module.exports = router;