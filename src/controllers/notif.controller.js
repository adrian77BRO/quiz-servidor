const Notificacion = require('../models/notificaciones');

const obtenerNotif = async (req, res) => {
    try {
        const notif = await Notificacion.find();

        return res.status(200).json(notif);

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener las notificaciones',
            error: error.message
        });
    }
}

const agregarNotif = async (req, res) => {
    const { fecha, cuerpo } = req.body;
    try {
        const nuevaNotif = new Notificacion({
            fecha, cuerpo
        });
        await nuevaNotif.save();

        res.status(201).json({
            message: 'Nueva notificación'
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al agregar la notificación",
            error: error.message
        });
    }
};

module.exports = {
    agregarNotif,
    obtenerNotif
}