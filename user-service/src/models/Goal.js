const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const User = require('./User');

const Goal = sequelize.define('Goal', {
  goal_id: {
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
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['weight', 'activity', 'xpgoal', 'stepgoal']]
    }
  },
  target_value: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  target_date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'goals',
  timestamps: true
});

// Association
Goal.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Goal, { foreignKey: 'user_id' });

module.exports = Goal;
