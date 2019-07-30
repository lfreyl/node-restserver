//==================================
//Puerto
//==================================
process.env.PORT = process.env.PORT || 3000;
//==================================
//Entorno
//==================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//==================================
//base de datos
//==================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://frey:KaSes6a3Jy1I3wkd@cluster0-uidno.mongodb.net/cafe';
};
process.env.URLDB = urlDB;