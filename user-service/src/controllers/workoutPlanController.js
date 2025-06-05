const db = require('../models');
const { post, get } = require('../utils/universalDML');

class WorkoutPlanController { 

    getAllWorkoutPlans = async (req, res) => {
        try {
            const plans = await db.WorkoutPlan.findAll({
                order: [['name', 'ASC']]
            });

            res.status(200).json(plans); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    getWorkoutPlanById = async (req, res) => {
        try {
            const planId = req.params.id;
            
            // First try to find the plan without includes to verify it exists
            const basicPlan = await db.WorkoutPlan.findByPk(planId);
            
            if (!basicPlan) {
                return res.status(404).json({ error: 'Workout plan not found' });
            }
            
            // Now try to include the exercises
            try {
                const plan = await db.WorkoutPlan.findByPk(planId, {
                    include: [{
                        model: db.Exercise,
                        through: {
                            attributes: ['sets', 'reps_targets', 'duration']
                        }
                    }]
                });
                
                res.status(200).json(plan);
            } catch (includeError) {
                // If including exercises fails, at least return the basic plan
                console.error("Error including exercises:", includeError);
                res.status(200).json(basicPlan);
            }
        } catch (error) {
            res.status(500).json({ error: error.message }); 
        }
    }
    get = get(db.WorkoutPlan)

    createWorkoutPlan = async (req, res) => {
        try {
            const { name, description, difficulty_level, exercises } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Plan name is required' });
            }

            const plan = await db.WorkoutPlan.create({
                name, 
                description, 
                difficulty_level, 
                created_at: new Date()
            });

            if (exercises && Array.isArray(exercises)) {
                for (const exercise of exercises) {
                    await db.WorkoutPlanExercise.create({
                        plan_id: plan.plan_id,
                        exercise_id: exercise.exercise_id,
                        sets: exercise.sets,
                        reps_targets: exercise.reps_targets,
                        duration: exercise.duration
                    });
                }
            }

            const createdPlan = await db.WorkoutPlan.findByPk(plan.plan_id, {
                include: [{
                    model: db.Exercise,
                    through: {
                        attributes: ['sets', 'reps_targets', 'duration']
                    }
                }]
            }); 

            res.status(201).json(createdPlan); 

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    addExerciseToPlan = async (req, res) => {
        try {
            const planId = req.params.planId;
            const { exercise_id, sets, reps_targets, duration } = req.body;

            if (!exercise_id) {
                return res.status(400).json({ error: 'Exercise ID is required' });
            }

            const plan = await db.WorkoutPlan.findByPk(planId);
            if (!plan) {
                return res.status(404).json({ error: 'Workout plan not found' }); 
            }

            const exercise = await db.Exercise.findByPk(exercise_id); 
            if (!exercise) {
                return res.status(404).json({ error: 'Exercise not found' }); 
            }

            await db.WorkoutPlanExercise.create({
                plan_id: planId, 
                exercise_id, 
                sets,
                reps_targets, 
                duration
            });

            const updatedPlan = await db.WorkoutPlan.findByPk(planId, {
                include: [{
                    model: db.Exercise, 
                    through: {
                        attributes: ['sets', 'reps_targets', 'duration']
                    }
                }]
            });
            res.status(200).json(updatedPlan); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = WorkoutPlanController; 
