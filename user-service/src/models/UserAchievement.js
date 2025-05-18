module.exports = (sequelize, DataTypes) => {
  const UserAchievement = sequelize.define('UserAchievement', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    achievement_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'achievements',
        key: 'achievement_id'
      }
    },
    achieved_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'user_achievements',
    timestamps: false
  });
  
  return UserAchievement;
};