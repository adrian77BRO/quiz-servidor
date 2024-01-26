require('dotenv').config();
require('./src/database');

const Pregunta = require('./src/models/preguntas');
const mongoose = require('mongoose');

const preguntas = [
    { id: 1, pregunta: '¿Cuánto es 6 x 9?', opciones: ['15', '54', '3', '1.5'], respuesta: '54' },
    { id: 2, pregunta: '¿Qué animal es un reptil?', opciones: ['jirafa', 'delfín', 'tortuga', 'pingüino'], respuesta: 'tortuga' },
    { id: 3, pregunta: '¿Qué país ganó el mundial en 2014?', opciones: ['Alemania', 'Brasil', 'Francia', 'Italia'], respuesta: 'Alemania' },
    { id: 4, pregunta: '¿Quién es el corredor más rápido del mundo?', opciones: ['Michael Phelps', 'Kylian Mbappé', 'Roger Federer', 'Usain Bolt'], respuesta: 'Usain Bolt' },
    { id: 5, pregunta: '¿Cuál es el planeta más grande del sistema solar?', opciones: ['Saturno', 'Neptuno', 'Júpiter', 'Urano'], respuesta: 'Júpiter' },
    { id: 6, pregunta: '¿En qué país está Chichén Itzá?', opciones: ['España', 'México', 'Argentina', 'Perú'], respuesta: 'México' },
    { id: 7, pregunta: '¿Cuántos segundos tiene un día?', opciones: ['3600', '1440', '72,000', '86,400'], respuesta: '86,400' },
    { id: 8, pregunta: '¿Cuántos huesos tiene el ser humano adulto?', opciones: ['206', '570', '345', '462'], respuesta: '206' },
    { id: 9, pregunta: '¿De que país son los canguros?', opciones: ['Japón', 'China', 'Australia', 'Nueva Zelanda'], respuesta: 'Australia' },
    { id: 10, pregunta: '¿Cuál es el animal más grande del mundo?', opciones: ['elefante africano', 'anaconda', 'oso polar', 'ballena azul'], respuesta: 'ballena azul' }
];

Pregunta.deleteMany({})
    .then(() => {
        return Pregunta.insertMany(preguntas);
    })
    .then(() => {
        console.log('Preguntas creadas');
        mongoose.connection.close();
    })
    .catch((error) => {
        console.log(error);
        mongoose.connection.close();
    })