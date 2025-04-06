const { Op } = require('sequelize');
const db = require('../models');
const { validateExerciseData } = require('../utils/validation');

class ExerciseContoller { 
    createExercise = async (req, res) => {
        try {
            const exerciseData = req.body;

            const validation = validateExerciseData(exerciseData);

            if (!validation.isValid) {
                return res.status(400).json({ error: validation.error }); 
            }
        

        const exercise = await db.Exercise.create({
            name: exerciseData.name,
            description: exerciseData.description,
            type: exerciseData.type,
            measurement_type: exerciseData.measurement_type, 
            difficulty_level: exerciseData.difficulty_level,
            target_muscle_group: exerciseData.target_muscle_group,
            created_at: new Date()
        });

        res.status(201).json(exercise);
    } catch (error) {
        res.status(500).json({ error: error.message });
        }
    }

    getExerciseById = async (req, res) => {
        try {
            const exerciseId = req.params.id; 
            const exercise = await db.Exercise.findByPk(exerciseId);

            if (!exercise) {
                return res.status(404).json({ error: 'Exercise not found' });
            }

            res.status(200).json(exercise);
        } catch (error) {
            res.status(500).json({ error: error.message }); 
        }
    }

    getAllExercises = async (req, res) => {
        try {
            const {
                type,
                difficulty_level,
                target_muscle_group,
                page = 1, 
                limit = 20
            } = req.query; 
            
            const offset = (page - 1) * limit;

            const whereClause = {};
            if (type) whereClause.type = type;
            if (difficulty_level) whereClause.difficulty_level = difficulty_level;
            if (target_muscle_group) whereClause.target_muscle_group = target_muscle_group;

            const exercises = await db.Exercise.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['name', 'ASC']]
            });

            res.status(200).json({
                exercises: exercises.rows,
                totalCount: exercises.count,
                totalPages: Math.ceil(exercises.count / limit), 
                currentPage: parseInt(page)
            });
        } catch (error) {
            res.status(500).json({ error: error.message }); 
        }
    }

    updateExercise = async (req, res) => {
        try {
            const exerciseId = req.params.id;
            const updateData = req.body;

            const exercise = await db.Exercise.findByPk(exerciseId);
            if (!exercise) {
                return res.status(404).json({ error: 'Exercise not found'}); 
            }

            if (updateData.type || updateData.measurement_type) {
                const dataToValidate = {
                    name: updateData.name || exercise.name, 
                    type: updateData.type || exercise.type,
                    measurement_type: updateData.measurement_type || exercise.measurement_type
                };

                const validation = validateExerciseData(dataToValidate);
                if (!validation.isValid) {
                    return res.status(400).json({ error: validation.error }); 
                }                
            }

            await exercise.update(updateData);

            const updatedExercise = await db.Exercise.findByPk(exerciseId);
            res.status(200).json(updatedExercise);
        } catch (error) {
            res.status(500).json({ error: error.message }); 
        }
    }

    deleteExercise = async (req, res) => {
        try {
            const exerciseId = req.params.id; 
            const exercise = await db.Exercise.findByPk(exerciseId);

            if (!exercise) {
                return res.status(404).json({ error: "Exercise not found" });
            }

            await exercise.destroy();
            res.status(200).json({ message: 'Exercise successfully deleted' }); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ExerciseContoller; 