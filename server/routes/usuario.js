const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
app.get('/', function(req, res) {
    res.json('Hello World')
});
app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 0;
    Usuario.find({ estado: true }, 'nombre email role estado img google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            };

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });


        });
});
app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        estado: body.estado
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        };
        // usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
app.put('/usuario', function(req, res) {
    res.json('put Usuario')
});
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['email', 'nombre', 'img', 'role', 'estado']);
    // delete body.password;
    // delete body.google;
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };
    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });
});

module.exports = app;