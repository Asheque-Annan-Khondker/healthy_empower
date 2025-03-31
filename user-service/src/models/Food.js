const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const UnitOfMeasurement = require('./UnitOfMeasurement');

const Food = sequelize.define('Food', {
  food_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  protein: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  carbs: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fat: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  serving_size: {
    type: DataTypes.STRING,
    allowNull: true
  },
  serving_unit_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'units_of_measurement',
      key: 'unit_id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'food',
  timestamps: false
});

// Association
Food.belongsTo(UnitOfMeasurement, { foreignKey: 'serving_unit_id' });
UnitOfMeasurement.hasMany(Food, { foreignKey: 'serving_unit_id' });

module.exports = Food;
