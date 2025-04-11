const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const User = require('./User');
const Achievement = require('./Achievement');

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

// Many-to-many association
User.belongsToMany(Achievement, { through: UserAchievement, foreignKey: 'user_id' });
Achievement.belongsToMany(User, { through: UserAchievement, foreignKey: 'achievement_id' });

module.exports = UserAchievement;
