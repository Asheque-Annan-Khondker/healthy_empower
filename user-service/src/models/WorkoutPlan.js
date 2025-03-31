const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const WorkoutPlan = sequelize.define('WorkoutPlan', {
  plan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  difficulty_level: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'workout_plans',
  timestamps: false
});

module.exports = WorkoutPlan;
