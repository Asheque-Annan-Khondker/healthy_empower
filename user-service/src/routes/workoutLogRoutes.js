const express = require('express');
const router = express.Router({ mergeParams: true }); 

module.exports = (workoutLogController) => {
    router.post('/', workoutLogController.logWorkout);
    router.get('/', workoutLogController.getUserWorkoutLog);
    router.get('/:logId', workoutLogController.getWorkoutByLogId);
    router.put('/:logId', workoutLogController.updateWorkoutLog);
    router.delete('/:logId', workoutLogController.deleteWorkoutLog); 

    return router; 
}; 