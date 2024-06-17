const express = require ('express');
const router = express.Router();
const EstudiantesController = require('../controllers/estudiantesController');

router.get('/', EstudiantesController.consultar);
router.post('/', EstudiantesController.ingresar);

router.route('/:id')
   .get(EstudiantesController.consultarDetalle)
   .put(EstudiantesController.actualizar)
   .delete(EstudiantesController.borrar)

 module.exports = router;