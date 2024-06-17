const express = require ('express');
const router = express.Router();
const ProfesoresController = require('../controllers/profesoresController');

router.get('/', ProfesoresController.consultar);
router.post('/', ProfesoresController.ingresar);

router.route('/:id')
   .get(ProfesoresController.consultarDetalle)
   .put(ProfesoresController.actualizar)
   .delete(ProfesoresController.borrar);

 module.exports = router;