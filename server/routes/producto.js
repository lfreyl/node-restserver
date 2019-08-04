const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');
let Categoria = require('../models/categoria');


//=============================
//Obtener todos los productos
//=============================
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 0;
    Producto.find({ disponible: true }, 'nombre precioUni descripcion img')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            };

            Producto.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });


        });
})

//=============================
//Obtener un produto por id
//=============================
app.get('/productos/:id', verificaToken, (req, res) => {
    //trae el producto con id 
    //paginado
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
})

//=============================
//Obtener un produto por id
//=============================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//=============================
//Actualizar producto
//=============================
app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar la categoria
    let id = req.params.id;
    let body = req.body;
    // Producto.findById(id, (err, productoDB) => {
    //         if (err) {
    //             return res.status(500).json({
    //                 ok: false,
    //                 err
    //             });
    //         }
    //         if (!productoDB) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err: {
    //                     message: 'El id no existe'
    //                 }
    //             });
    //         }
    //         productoDB.nombre = body.nombre;
    //         productoDB.precioUni = body.precio;
    //         productoDB.descripcion = body.descripcion;
    //         productoDB.disponible = body.disponible;
    //         productoDB.categoria = body.categoria;
    //         productoDB.save((err, productoGuardado) => {
    //             if (err) {
    //                 return res.status(500).json({
    //                     ok: false,
    //                     err
    //                 });
    //             }
    //             if (!productoGuardado) {
    //                 return res.status(400).json({
    //                     ok: false,
    //                     err
    //                 });
    //             }
    //             res.json({
    //                 ok: true,
    //                 producto: productoGuardado
    //             });
    //         });
    //     })
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

//=============================
//Borrar producto
//=============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //borrar un producto poniendo disponible en false
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        productoDB.disponible = false;
        productoDB.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Fallo al guardar'
                    }
                });
            }

        })
        res.json({
            ok: true,
            producto: productoDB,
            message: 'producto borrado'
        });
    });


});



//=============================
//Realizar busqueda de producto
//=============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    //trae todos los productos
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 0;
    Producto.find({ nombre: regex }, 'nombre precioUni descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            };

            Producto.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });


        });
})
module.exports = app;