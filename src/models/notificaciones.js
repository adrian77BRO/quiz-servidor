const mongoose = require('mongoose');

const notifSchema = mongoose.Schema({
    cuerpo: {
        type: String
    },
});

module.exports = mongoose.model('Notificacion', notifSchema);