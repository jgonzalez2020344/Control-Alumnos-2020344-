const Cursos = require('../models/cursos.models');
const Asignacion = require('../models/asignacion.models');

function agregarCursos(req, res) {
    var parametros = req.body;
    var modeloCursos = new Cursos();

    if (req.user.rol == 'maestro') {
        if (parametros.nombre) {
            modeloCursos.nombre = parametros.nombre;
            modeloCursos.idMaestro = req.user.sub;

            modeloCursos.save((err, cursoGuardado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!cursoGuardado) return res.status(500).send({ mensaje: 'Error al agregar curso' });

                return res.status(200).send({ cursos: cursoGuardado });
            })
        }
    } else {
        return res.status(500).send({ mensaje: 'Debe ingresar los parametros obligatorios' })
    }

}

function encontrarCursos(req, res) {
    if (req.user.rol == 'maestro') {
        Cursos.find({}, (err, cursosEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!cursosEncontrados) return res.status(500).send({ mensaje: 'Error al obtener las cursos' });
            return res.status(200).send({ cursos: cursosEncontrados });
        }).populate('idMaestro', 'nombres');
    }

}

function editarCursos(req, res) {
    var idCur = req.params.idCursos;
    var parametros = req.body;

    if (req.user.rol == 'maestro') {
        Cursos.findByIdAndUpdate(idCur, parametros, { new: true }, (err, cursosEditados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
            if (!cursosEditados) return res.status(403).send({ mensaje: 'Error al editar el cursos' });
            return res.status(200).send({ cursos: cursosEditados });
        })
    } else {
        return res.status(500).send({ mensaje: 'No tiene los permisos' });
    }

}

function eliminarCursos(req, res) {
    var idCur = req.params.idCursos;
    var asg = new Asignacion();

    asg.idCurso = '620d231ee13eba221af0a9e5'
    asg.idMaestro = '620d2e870287c33039ce4829';

    asg.save((err, cursoE) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!cursoE) return res.status(500).send({ mensaje: 'Error al agregar curso' });
         
        else {
            Cursos.findByIdAndDelete(idCur, (err, cursoEliminado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!cursoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el curso' });
                else{
                    Asignacion.find({idCurso: idCur}, (err, cursos) =>{
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                        if (!cursos) return res.status(500).send({ mensaje: 'Error al eliminar el curso'})

                        else {
                            cursos.forEach(element => {
                                Asignacion.findByIdAndDelete(element._id, (err, asignacionEliminada) =>{
                                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                if (!asignacionEliminada) return res.status(500).send({ mensaje: 'Error al eliminar el curso'})
                                })
                            });
                        } return res.status(200).send({ mensaje: 'Eliminado Correctamente'});
                        
                    })
                }
            })
        }
    })

    
}

module.exports = {
    agregarCursos,
    encontrarCursos,
    editarCursos,
    eliminarCursos
}