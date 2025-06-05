const { DataTypes } = require('sequelize');
const  sequelizeInstance  = require('./index').sequelize;

module.exports = (sequelizeInstance) => {
  const User = sequelizeInstance.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'UTC'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    currency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    current_streak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    longest_streak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    last_workout_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    double_acorn_equipped: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 for not equipped, 1 for equipped'
    },
    costume_selected: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Regular',
      comment: 'Name of the currently equipped costume'
    }
  }, {
    tableName: 'users',
    timestamps: false,
    underscored: true
  });
  return User;
};

