const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const config = require('./src/config');
const notifRoute = require('./src/routes/notif.route');
const mensajeRoute = require('./src/routes/mensajes.route');
require('./src/database');

const { handleWebSocketConnection } = require('./socket/socket');
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use('/notifs', notifRoute);
app.use('/mensajes', mensajeRoute);
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
    handleWebSocketConnection(wss, ws);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

server.listen(config.app.port, () => {
    console.log(`Servidor escuchando en 3000`);
});