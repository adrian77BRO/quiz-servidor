const Notificacion = require('../models/notificaciones');

const obtenerNotif = async (req, res) => {
    try {
        const notifs = await Notificacion.find();
        const notif = notifs[notifs.length - 1].cuerpo

        return res.status(200).json(notif);

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener las notificaciones',
            error: error.message
        });
    }
}

const agregarNotif = async (req, res) => {
    const { cuerpo } = req.body;
    try {
        const nuevaNotif = new Notificacion({
            cuerpo
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