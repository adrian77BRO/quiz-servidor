const WebSocket = require('ws');
const Pregunta = require('../src/models/preguntas');
require('../src/database');

let puntos = 0;
let preguntaID = 0;
let tiempoRestante = 10;
const usuariosConectados = new Set();

async function enviarPregunta(wss) {
    try {
        preguntaID = (preguntaID + 1);
        const preguntaActual = await Pregunta.findOne({ id: preguntaID });

        broadcast(wss, { type: 'nuevaPregunta', data: preguntaActual, tiempo: tiempoRestante });
        reiniciarTemporizador(wss);
        const num = await Pregunta.countDocuments();

        if (preguntaID === num + 1) {
            console.log('Fin de las preguntas');
            broadcast(wss, { type: 'finDelJuego', data: { puntos } });
            puntos = 0;
            return;
        }
    } catch (error) {
        console.error('Error al obtener la pregunta desde MongoDB:', error);
    }
}

function reiniciarTemporizador(wss) {
    clearInterval(temporizador);
    tiempoRestante = 10;

    temporizador = setInterval(() => {
        tiempoRestante -= 1;

        if (tiempoRestante === 0) {
            enviarPregunta(wss);
        }
    }, 1000);
}

function broadcast(wss, message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

let temporizador;
reiniciarTemporizador();

function handleWebSocketConnection(wss, ws) {
    console.log('Nuevo cliente conectado');
    usuariosConectados.add(ws);
    enviarPregunta(wss);
    broadcast(wss, { type: 'nuevoJugador', data: { totalJugadores: usuariosConectados.size } });

    ws.on('message', async (message) => {
        const respuesta = message.toString();
        const preguntaActual = await Pregunta.findOne({ id: preguntaID });
        const respuestaCorrecta = preguntaActual.respuesta;

        if (respuesta === respuestaCorrecta) {
            puntos += 1;
        }
        broadcast(wss, { type: 'puntos', data: puntos });
        enviarPregunta(wss);
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
        usuariosConectados.delete(ws);
        broadcast(wss, { type: 'jugadorDesconectado', data: { totalJugadores: usuariosConectados.size } });
        preguntaID = 0;
        puntos = 0;
    });
}

module.exports = { handleWebSocketConnection };