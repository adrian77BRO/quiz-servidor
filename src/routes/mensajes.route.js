const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensajes.controller');

router.get('/recibir', mensajeController.recibirMensajes);
router.get('/nuevo-mensaje', mensajeController.recibirNuevoMensaje);
router.post('/enviar', mensajeController.enviarMensaje);

module.exports = router;