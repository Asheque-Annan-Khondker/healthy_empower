const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.js')[env];
const sequelize = new Sequelize({
  dialect: config.dialect, 
  storage: config.storage,
  logging: config.logging
});


// Import models
const User = require('./User')(sequelize);


const HealthProfile = require('./HealthProfile')(sequelize, Sequelize.DataTypes);
/*
const Goal = require('./Goal');
const Exercise = require('./Exercise');
const WorkoutLog = require('./WorkoutLog');
const WorkoutPlan = require('./WorkoutPlan');
const WorkoutPlanExercise = require('./WorkoutPlanExercise');
const UnitOfMeasurement = require('./UnitOfMeasurement');
const Food = require('./Food');
const MealLog = require('./MealLog');
const Achievement = require('./Achievement');
const UserAchievement = require('./UserAchievement');
*/
User.hasOne(HealthProfile, { foreignKey: 'user_id' });
//User.hasMany(Goal, { foreignKey: 'user_id' });
//User.hasMany(WorkoutLog, { foreignKey: 'user_id' });
//User.hasMany(MealLog, { foreignKey: 'user_id' });
//User.belongsToMany(Achievement, { through: UserAchievement, foreignKey: 'user_id' });


HealthProfile.belongsTo(User, { foreignKey: 'user_id' });
/*
Goal.belongsTo(User, { foreignKey: 'user_id' });
Exercise.hasMany(WorkoutLog, { foreignKey: 'exercise_id' });
Exercise.belongsToMany(WorkoutPlan, { through: WorkoutPlanExercise, foreignKey: 'exercise_id' });
WorkoutLog.belongsTo(User, { foreignKey: 'user_id' });
WorkoutLog.belongsTo(Exercise, { foreignKey: 'exercise_id' });
WorkoutPlan.belongsToMany(Exercise, { through: WorkoutPlanExercise, foreignKey: 'plan_id' });
Food.belongsTo(UnitOfMeasurement, { foreignKey: 'serving_unit_id' });
Food.hasMany(MealLog, { foreignKey: 'food_id' });
UnitOfMeasurement.hasMany(Food, { foreignKey: 'serving_unit_id' });
MealLog.belongsTo(User, { foreignKey: 'user_id' });
MealLog.belongsTo(Food, { foreignKey: 'food_id' });
Achievement.belongsToMany(User, { through: UserAchievement, foreignKey: 'achievement_id' });
*/ 



const db = {
  sequelize,
  Sequelize,
  User,
  HealthProfile
  /*
  Goal,
  Exercise,
  WorkoutLog,
  WorkoutPlan,
  WorkoutPlanExercise,
  UnitOfMeasurement,
  Food,
  MealLog,
  Achievement,
  UserAchievement
  */
};


module.exports = db;
