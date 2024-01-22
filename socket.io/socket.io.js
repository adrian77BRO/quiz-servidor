const { Server } = require('socket.io');

function handleSocketIOConnection(io, socket) {
    console.log('Nuevo cliente de Socket.IO conectado');

    socket.on('message', (cuerpo) => {
        console.log(cuerpo);
        broadcast(io, {
            type: 'message',
            cuerpo,
            from: socket.id.slice(6)
        });
    });

    socket.on('disconnect', () => {
        console.log('Cliente de Socket.IO desconectado');
    });

    socket.emit('puntos', puntos);
}

function broadcast(io, message) {
    io.emit('message', message);
}

module.exports = { handleSocketIOConnection };
