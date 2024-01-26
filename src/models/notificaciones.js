const mongoose = require('mongoose');

const notifSchema = mongoose.Schema({
    cuerpo: {
        type: String
    },
    fecha: {
        type: Date
    }
});

module.exports = mongoose.model('Notificacion', notifSchema);