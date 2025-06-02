const express = require('express');
const router = express.Router();

module.exports = (workoutPlanExerciseController) => {
    router.get('/', workoutPlanExerciseController.get);
    
    return router;
};
