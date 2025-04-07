const db = require('../models');

class WorkoutLogController {
    logWorkout = async (req, res) => {
        try {
            const userId = req.params.userId;
            const { exercise_id, sets_completed, reps_completed, duration, notes, completed_at } = req.body;


            if (!exercise_id) {
                return res.status(400).json({ error: 'Exercise ID is required' });
            }

            const user = await db.User.findByPk(userId); 
            if (!user) {
                return res.status(404).json({ error: 'User not found' }); 
            }

            const exercise = await db.Exercise.findByPk(exercise_id);
            if (!exercise) {
                return res.status(404).json({ error: 'Exercise not found' }); 
            }

            const workoutLog = await db.WorkoutLog.create({
                user_id: userId,
                exercise_id, 
                completed_at: completed_at || new Date(),
                sets_completed,
                reps_completed,
                duration, 
                notes
            });

            const createdLog = await db.WorkoutLog.findByPk(workoutLog.log_id, {
                include: [{ model: db.Exercise }]
            });
            
            res.status(201).json(createdLog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getUserWorkoutLog = async (req, res) => {
        try {
            const userId = req.params.userId;
            const { date, startDate, endDate, exercise_id } = req.query;

            const user = await db.User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' }); 
            }


            const whereClause = { user_id: userId }; 

            if (date) {
                const targetDate = new Date(date);
                const nextDay = new Date(targetDate); 
                nextDay.setDate(nextDay.getDate() + 1);

                whereClause.completed_at = {
                    [db.Sequelize.Op.gte]: targetDate,
                    [db.Sequelize.Op.lt]: nextDay
                };
            } else if (startDate && endDate) {
                whereClause.completed_at = {
                    [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
                };
            }

            if (exercise_id) {
                whereClause.exercise_id = exercise_id; 
            }

            const logs = await db.WorkoutLog.findAll({
                where: whereClause,
                include: [{ model: db.Exercise }],
                order: [['completed_at', 'DESC']]
            });

            res.status(200).json(logs); 
        } catch (error) {
            res.status(500).json({ error: error.message }); 
        }
    }

    getWorkoutByLogId = async (req, res) => {
        try {
            const userId = req.params.userId;
            const logId = req.params.logId; 

            const user = await db.User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' }); 
            }

            const log = await db.WorkoutLog.findOne({
                where: {
                    log_id: logId,
                    user_id: userId
                },
                include: [{ model: db.Exercise }]
            });

            if (!log) {
                return res.status(404).json({ error: 'Workout log not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message }); 
        }
    }

    updateWorkoutLog = async (req, res) => {
        try {
            const userId = req.params.userId;
            const logId = req.params.logId; 
            const { sets_completed, reps_completed, duration, notes, completed_at } = req.body;

            const user = await db.User.findByPk(userId);   
            if (!user) {
                return res.status(404).json({ error: 'User not found' }); 
            }

            const log = await db.WorkoutLog.findOne({
                where: {
                    log_id: logId, 
                    user_id: userId
                }
            });

            if (!log) {
                return res.status(404).json({ error: 'Workout log not found' }); 
            }

            await log.update({
                sets_completed: sets_completed !== undefined ? sets_completed : log.sets_completed,
                reps_completed: reps_completed !== undefined ? reps_completed : log.reps_completed,
                duration: duration !== undefined ? duration : log.duration,
                notes: notes !== undefined ? notes : log.notes,
                completed_at: completed_at ? new Date(completed_at) : log.completed_at
            });

            const updatedLog = await db.WorkoutLog.findByPk(log.log_id, {
                include: [{ model: db.Exercise }]
            });
            
            res.status(200).json(updatedLog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }   
    }

    deleteWorkoutLog = async (req, res) => {
        try {
            const userId = req.params.usedId;
            const logId = req.params.logId; 

            const user = await db.User.findbyPk(userId); 
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const log = await db.WorkoutLog.findOne({
                where: {
                    log_id: logId,
                    user_id: userId
                }
            });

            if (!log) {
                return res.status(404).json({ error: 'Workout log not found' });
            }

            await log.destroy(); 

            res.status(200).json({ message: 'Workout log successfully deleted' })

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = WorkoutLogController;