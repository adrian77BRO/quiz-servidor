const Mensaje = require('../models/mensajes');
let nuevosMensajes = [];

const recibirMensajes = async (req, res) => {
    try {
        const mensajes = await Mensaje.find();
        const esperarMensaje = () => {
            if (mensajes.length > 0) {
                res.status(200).json(mensajes);
            }
        };
        esperarMensaje();

    } catch (error) {
        return res.status(500).json({
            message: 'Error al cargar los mensajes',
            error: error.message
        });
    }
}

/*const recibirNuevoMensaje = async (req, res) => {
    try {
        const mensaje = mensajes[mensajes.length - 1];
        const esperarMensaje = () => {
            if (mensaje) {
                res.status(200).json(mensaje);
            }
        };
        esperarMensaje();

    } catch (error) {
        return res.status(500).json({
            message: 'Error al cargar los mensajes',
            error: error.message
        });
    }
}*/

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
    recibirMensajes,
    //recibirNuevoMensaje,
    enviarMensaje,
}