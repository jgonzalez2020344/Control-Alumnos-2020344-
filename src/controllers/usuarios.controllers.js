const Usuarios = require('../models/usuarios.models');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt'); 

function RegistrarMaestro(req, res) {
    var parametros = req.body;
    var modeloUsuarios = new Usuarios();

        if(parametros.nombres && parametros.email && parametros.password) {
            Usuarios.find({ email : parametros.email }, (err, usuariosEncontrados) => {
                if ( usuariosEncontrados.length > 0 ){ 
                    return res.status(500)
                        .send({ mensaje: "Este correo ya se encuentra en uso" })
                } else {
                    modeloUsuarios.nombres = parametros.nombres;
                    modeloUsuarios.email = parametros.email;
                    modeloUsuarios.password = '123456';
                    modeloUsuarios.rol = 'maestro';

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        modeloUsuarios.password = passwordEncriptada;

                        modeloUsuarios.save((err, usuariosGuardados)=>{
                            if(err) return res.status(500).send({ mensaje : 'Error en la peticion' })
                            if(!usuariosGuardados) return res.status(500).send({ mensaje: 'Error al guardar el Usuario' })
    
                            return res.status(200).send({ token: jwt.crearToken(usuariosEncontrados)})
                        })
                    })                    
                }
            })
    } else {
        return res.status(404)
            .send({ mensaje : 'Debe ingresar los parametros obligatorios'})
    }

}


function RegistrarAlumno(req, res) {
    var parametros = req.body;
    var modeloUsuarios = new Usuarios();

        if(parametros.nombres && parametros.email && parametros.password) {
                Usuarios.find({ email : parametros.email }, (err, usuariosEncontrados) => {
                    if ( usuariosEncontrados.length > 0 ){ 
                        return res.status(500).send({ mensaje: "Este correo ya se encuentra utilizado" })
                    } else {
                        modeloUsuarios.nombres = parametros.nombres;
                        modeloUsuarios.password = parametros.password;
                        modeloUsuarios.email = parametros.email;
                        modeloUsuarios.rol = 'alumno';
    
                        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                            modeloUsuarios.password = passwordEncriptada;
    
                            modeloUsuarios.save((err, usuariosGuardados) => {
                                if(err) return res.status(500).send({ mensaje : 'Error en la peticion' })
                                if(!usuariosGuardados) return res.status(500).send({ mensaje: 'Error al guardar el Usuario' })
        
                                return res.status(200).send({ usuario: usuariosGuardados})
                            })
                        })                    
                    }
                })
        } else {
            return res.status(404).send({ mensaje : 'Debe ingresar los parametros obligatorios'})
        }
}



function Login(req, res) {
    var parametros = req.body;

    Usuarios.findOne({ email : parametros.email }, (err, usuariosEncontrados) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if (usuariosEncontrados){

            bcrypt.compare(parametros.password, usuariosEncontrados.password, (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        return res.status(200).send({ token: jwt.crearToken(usuariosEncontrados) })
                    } else {
                        return res.status(500).send({ mensaje: 'La contrasena no coincide'})
                    }
                })
        } else {
            return res.status(500).send({ mensaje: 'El usuario, no se ha podido identificar'})
        }
    })
}


function editarUsuarios(req, res) {
    var idUs = req.params.idUsuarios;
    var parametros = req.body;

    delete parametros.password; 
            if(req.user.sub == !idUs) {
                return res.status(500).send({message:'No tiene permisos para editar este usuario'});
            } 
            Usuarios.findByIdAndUpdate(req.user.sub, parametros, {new:true}, (err, usuariosEditados) =>  {
                if (err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
              
                if (!usuariosEditados) return res.status(500).send({mensaje: 'Error al editar el usuario'});

                return res.status(200).send({usuarios: usuariosEditados});
            })
    } 


function eliminarUsuarios(req, res) {
    var idUs = req.params.idUsuarios;

        Usuarios.findByIdAndDelete(idUs, (err, usuariosEliminados)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!usuariosEliminados) return res.status(500)
                .send({ mensaje: 'Error al eliminar el usuario' })
    
            return res.status(200).send({ usuarios: usuariosEliminados });
        })
    }

module.exports = {
    RegistrarMaestro,
    RegistrarAlumno,
    Login,
    editarUsuarios,
    eliminarUsuarios
}