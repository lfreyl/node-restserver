const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'El pass es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        required: [true, 'El estado es necesario']
    },
    google: {
        type: Boolean,
        required: false,
        default: false
    }
});
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);