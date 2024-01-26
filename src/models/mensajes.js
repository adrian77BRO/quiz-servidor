const mongoose = require('mongoose');

const mensajeSchema = mongoose.Schema({
    usuario: {
        type: String,
    },
    mensaje: {
        type: String,
    }
});

module.exports = mongoose.model('Mensaje', mensajeSchema);