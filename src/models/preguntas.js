const mongoose = require('mongoose');

const preguntaSchema = mongoose.Schema({
    id: {
        type: Number,
    },
    pregunta: {
        type: String,
    },
    opciones: {
        type: [String],
    },
    respuesta: {
        type: String,
    },
});

module.exports = mongoose.model('Pregunta', preguntaSchema);