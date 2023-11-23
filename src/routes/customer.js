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
module.exports = router;