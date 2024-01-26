const mongoose = require('mongoose');
const config = require('./config');

const conectarDB = async () => {
    try {
        await mongoose.connect(config.mongodb.database);
        console.log('BD conectada exitosamente');

    } catch (error) {
        console.log('Error al conectar la base de datos', error);
    }
};

conectarDB();