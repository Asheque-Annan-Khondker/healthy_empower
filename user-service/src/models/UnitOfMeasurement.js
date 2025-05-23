module.exports = (sequelize, DataTypes) => {
  const UnitOfMeasurement = sequelize.define('UnitOfMeasurement', {
    unit_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    abbreviation: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'units_of_measurement',
    timestamps: false
  });

  return UnitOfMeasurement; 
}
