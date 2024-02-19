const Mensaje = require('../models/mensajes');
let clientes = [];

const recibirMensajes = async (req, res) => {
    try {
        const mensajes = await Mensaje.find();
        return res.status(200).json(mensajes);

    } catch (error) {
        return res.status(500).json({
            message: 'Error al cargar los mensajes',
            error: error.message
        });
    }
}

const recibirNuevoMensaje = (req, res) => {
    try {
        clientes.push(res);

        req.on('close', () => {
            const index = clientes.indexOf(res);
            if (index !== -1) {
                clientes.splice(index, 1);
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error al cargar el mensaje',
            error: error.message
        });
    }
}

const enviarMensaje = async (req, res) => {
    const { usuario, mensaje } = req.body;
    try {
        const nuevoMensaje = new Mensaje({
            usuario, mensaje
        });
        await nuevoMensaje.save();

        responderClientes(nuevoMensaje);

        res.status(201).json({
            message: "Mensaje enviado"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error al enviar el mensaje",
            error: error.message
        });
    }
};

function responderClientes(nuevoMensaje) {
    for (const res of clientes) {
        res.status(200).json(nuevoMensaje);
    }
}

module.exports = {
    recibirMensajes,
    recibirNuevoMensaje,
    enviarMensaje,
}