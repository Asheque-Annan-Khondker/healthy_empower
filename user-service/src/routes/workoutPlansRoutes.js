const express = require('express'); 
const router = express.Router();

module.exports = (workoutPlanController) => {
    router.get('/', workoutPlanController.getAllWorkoutPlans);
    router.get('/:id', workoutPlanController.getWorkoutPlanById);
    router.post('/', workoutPlanController.createWorkoutPlan);
    router.post('/:planId/exercises', workoutPlanController.addExerciseToPlan); 

    return router;
};