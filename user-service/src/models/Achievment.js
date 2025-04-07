const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Achievement = sequelize.define('Achievement', {
  achievement_id: {
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
  required_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'achievements',
  timestamps: false
});

module.exports = Achievement;
