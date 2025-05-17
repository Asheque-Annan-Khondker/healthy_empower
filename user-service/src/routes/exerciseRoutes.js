const express = require('express');
const router = express.Router();


module.exports = (exerciseController) => {
    router.get('/', exerciseController.get)
    router.get('/:id', exerciseController.getExerciseById);
    router.post('/', exerciseController.createExercise);
    router.put('/:id', exerciseController.updateExercise);
    router.delete('/:id', exerciseController.deleteExercise);

    return router; 
};
