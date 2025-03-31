 const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Exercise = sequelize.define('Exercise', {
  exercise_id: {
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
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  measurement_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  difficulty_level: {
    type: DataTypes.STRING,
    allowNull: true
  },
  target_muscle_group: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'exercises',
  timestamps: false
});

module.exports = Exercise;
