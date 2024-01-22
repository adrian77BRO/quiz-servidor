const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');

const { handleWebSocketConnection } = require('./websockets/websockets');
const { handleSocketIOConnection } = require('./socket.io/socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    handleWebSocketConnection(wss, ws);
});

io.on('connection', (socket) => {
    handleSocketIOConnection(io, socket);
});

server.listen(3000, () => {
    console.log('Servidor escuchando en 3000');
});
