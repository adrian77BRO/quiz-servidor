const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensajes.controller');

router.get('/recibir', mensajeController.recibirMensaje);
router.post('/enviar', mensajeController.enviarMensaje);

module.exports = router;