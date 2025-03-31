 const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const User = require('./User');
const Exercise = require('./Exercise');

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

// Associations
WorkoutLog.belongsTo(User, { foreignKey: 'user_id' });
WorkoutLog.belongsTo(Exercise, { foreignKey: 'exercise_id' });
User.hasMany(WorkoutLog, { foreignKey: 'user_id' });
Exercise.hasMany(WorkoutLog, { foreignKey: 'exercise_id' });

module.exports = WorkoutLog;
