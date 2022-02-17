const Asignaciones = require('../models/asignacion.models');

function agregarAsignaciones(req, res) {
    var parametros = req.body;
    var modeloAsignaciones = new Asignaciones();

    if (req.user.rol == 'alumno') {
        if (parametros.idCurso && parametros.idAlumno
) {
            modeloAsignaciones.idCurso = req.user.sub;
            modeloAsignaciones.idAlumno = parametros.idAlumno
;
            modeloAsignaciones.cAsignados + 1;

            
            if (parametros.cAsignados < 3){
                modeloAsignaciones.save((err, asgGuardada) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!asgGuardada) return res.status(500).send({ mensaje: 'Error al agregar asignacion' });
                    return res.status(200).send({ asignacion: asgGuardada });
                })
            }else{
                return res.status(500).send({ mensaje: 'Ya tiene el maximo de asignaciones'});
            }
        }else{
            return res.status(500).send({ mensaje: 'Faltan datos'});
        }

    } else {
        return res.status(500).send({ mensaje: 'Debe ingresar los parametros obligatorios' })
    }

}

module.exports = {
    agregarAsignaciones
}