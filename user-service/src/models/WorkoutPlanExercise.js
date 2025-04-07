module.exports = (sequelize, DataTypes) => {
  const WorkoutPlanExercise = sequelize.define('WorkoutPlanExercise', {
    plan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'workout_plans',
        key: 'plan_id'
      }
    },
    exercise_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'exercises',
        key: 'exercise_id'
      }
    },
    sets: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reps_targets: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'workout_plan_exercises',
    timestamps: false
  });

  return WorkoutPlanExercise;
}