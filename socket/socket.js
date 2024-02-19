const Pregunta = require('../src/models/preguntas');
require('../src/database');

let puntos = 0;
let preguntaID = 0;
let tiempoRestante = 10;
const usuariosConectados = new Set();

async function enviarPregunta(io, room) {
    try {
        preguntaID = (preguntaID + 1);
        const preguntaActual = await Pregunta.findOne({ id: preguntaID });
        const message = { event: 'nuevaPregunta', data: { pregunta: preguntaActual, tiempo: tiempoRestante } };
        broadcast(io, room, message);
        reiniciarTemporizador(io, room);
        const num = await Pregunta.countDocuments();

        if (preguntaID === num + 1) {
            console.log('Fin de las preguntas');
            const finDelJuegoMessage = { event: 'finDelJuego', data: { puntaje: puntos } };
            broadcast(io, room, finDelJuegoMessage);
            puntos = 0;
            return;
        }
    } catch (error) {
        console.error('Error al obtener la pregunta desde MongoDB:', error);
    }
}

function reiniciarTemporizador(io, room) {
    clearInterval(temporizador);
    tiempoRestante = 10;

    temporizador = setInterval(() => {
        tiempoRestante -= 1;

        if (tiempoRestante === 0) {
            enviarPregunta(io, room);
        }
    }, 1000);
}

function broadcast(io, room, message) {
    io.to(room).emit(message.event, message.data);
}

let temporizador;
reiniciarTemporizador();

function handleSocketConnection(io, socket) {
    console.log('Nuevo cliente conectado');
    usuariosConectados.add(socket);

    socket.on('joinRoom', async (room, username) => {
        socket.join(room);
        console.log(`${username} se unió a la sala: ${room}`);
        enviarPregunta(io, room);
        io.emit('nuevoJugador', { totalJugadores: usuariosConectados.size });
    });

    socket.on('respuesta', async (respuesta, room) => {
        const preguntaActual = await Pregunta.findOne({ id: preguntaID });
        const respuestaCorrecta = preguntaActual.respuesta;

        if (respuesta === respuestaCorrecta) {
            puntos += 1;
        }
        const puntosMessage = { event: 'puntos', data: puntos };
        broadcast(io, room, puntosMessage);
        enviarPregunta(io, room);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuariosConectados.delete(socket);
        io.emit('jugadorDesconectado', { totalJugadores: usuariosConectados.size });
        preguntaID = 0;
        puntos = 0;
    });
}

module.exports = { handleSocketConnection };