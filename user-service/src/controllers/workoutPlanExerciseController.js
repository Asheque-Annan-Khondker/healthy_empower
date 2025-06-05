const db = require('../models');
const { get } = require('../utils/universalDML');

class WorkoutPlanExerciseController {
    get = get(db.WorkoutPlanExercise)
}

module.exports = WorkoutPlanExerciseController;
