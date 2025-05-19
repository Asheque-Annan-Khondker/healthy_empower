module.exports = (sequelize, DataTypes) => {
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
      allowNull: false,
      validate: {
        isIn: [['workout', 'meal', 'goal', 'streak', 'weight']]
      }
    }
  }, {
    tableName: 'achievements',
    timestamps: false
  });
  
  return Achievement;
};