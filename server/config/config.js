//==================================
//Puerto
//==================================
process.env.PORT = process.env.PORT || 3000;
//==================================
//Entorno
//==================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//==================================
//Vencimiento del token
//==================================
//en segundos
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//==================================
//SEED de autenticacion
//==================================
process.env.SEED = process.env.SEED || 'este es el seed de desarrollo';
//==================================
//base de datos
//==================================
// heroku config:set MONGO_URI="XXXXXXX"

//     heroku config:get nombre
//     heroku config:unset nombre
//     heroku config:set nombre="Cristian"
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
};
process.env.URLDB = urlDB;