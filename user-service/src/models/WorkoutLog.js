module.exports = (sequelize, DataTypes) => {
  const WorkoutLog = sequelize.define('WorkoutLog', {
    log_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    exercise_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'exercises',
        key: 'exercise_id'
      }
    },
    workout_plan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'workout_plans',
        key: 'plan_id'
      }
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    sets_completed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reps_completed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'workout_logs',
    timestamps: false
  });

  return WorkoutLog;
}