const express = require('express');
const asignacionCursos = require('../controllers/asignacion.controllers');
const md_Autenticacion = require('../middlewares/autenticacion');
const api = express.Router();

api.post('/agregarAsignaciones', md_Autenticacion.Auth, asignacionCursos.agregarAsignaciones);

module.exports = api;