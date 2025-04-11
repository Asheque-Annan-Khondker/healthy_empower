module.exports = (sequelize, DataTypes) => {
  const MealLog = sequelize.define('MealLog', {
    meal_id: {
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
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'food',
        key: 'food_id'
      }
    },
    meal_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    servings: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 1.0
    },
    logged_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'meal_logs',
    timestamps: false
  });

  return MealLog;
}
