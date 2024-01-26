const Mensaje = require('../models/mensajes');
let messages = [];

const recibirMensaje = async (req, res) => {
    try {
        const mensajes = await Mensaje.find();
        messages.push(...mensajes);

        const esperarMensajes = () => {
            if (messages.length > 0) {
                res.status(200).json(messages);
                messages = [];
            } else {
                setTimeout(esperarMensajes, 1000);
            }
        };
        esperarMensajes();

    } catch (error) {
        return res.status(500).json({
            message: 'Error al cargar los mensajes',
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

        res.status(201).json({
            message: 'Mensaje enviado'
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al enviar el mensaje",
            error: error.message
        });
    }
};

module.exports = {
    recibirMensaje,
    enviarMensaje
}