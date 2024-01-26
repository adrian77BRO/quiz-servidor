const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notif.controller.js');

router.get('/getall', notifController.obtenerNotif);
router.post('/create', notifController.agregarNotif);

module.exports = router;