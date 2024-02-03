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
        const message = { type: 'nuevaPregunta', data: preguntaActual, tiempo: tiempoRestante };
        broadcast(wss, message);
        reiniciarTemporizador(wss);
        const num = await Pregunta.countDocuments();

        if (preguntaID === num + 1) {
            console.log('Fin de las preguntas');
            const finDelJuegoMessage = { type: 'finDelJuego', data: { puntos } };
            broadcast(wss, finDelJuegoMessage);
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
    const jugadoresConectadosMessage = { type: 'nuevoJugador', data: { totalJugadores: usuariosConectados.size } };
    broadcast(wss, jugadoresConectadosMessage);

    ws.on('message', async (message) => {
        const respuesta = message.toString();
        const preguntaActual = await Pregunta.findOne({ id: preguntaID });
        const respuestaCorrecta = preguntaActual.respuesta;

        if (respuesta === respuestaCorrecta) {
            puntos += 1;
        }
        const puntosMessage = { type: 'puntos', data: puntos };
        broadcast(wss, puntosMessage);
        enviarPregunta(wss);
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
        usuariosConectados.delete(ws);
        const jugadorDesconectadoMessage = { type: 'jugadorDesconectado', data: { totalJugadores: usuariosConectados.size } };
        broadcast(wss, jugadorDesconectadoMessage);
        preguntaID = 0;
        puntos = 0;
    });
}

module.exports = { handleWebSocketConnection };