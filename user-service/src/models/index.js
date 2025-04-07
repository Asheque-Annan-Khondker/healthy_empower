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

const Goal = require('./Goal')(sequelize, Sequelize.DataTypes);

const Exercise = require('./Exercise')(sequelize, Sequelize.DataTypes);

const WorkoutLog = require('./WorkoutLog')(sequelize, Sequelize.DataTypes);
const WorkoutPlan = require('./WorkoutPlan')(sequelize, Sequelize.DataTypes);
const WorkoutPlanExercise = require('./WorkoutPlanExercise')(sequelize, Sequelize.DataTypes);

const UnitOfMeasurement = require('./UnitOfMeasurement')(sequelize, Sequelize.DataTypes);
const Food = require('./Food')(sequelize, Sequelize.DataTypes);
const MealLog = require('./MealLog')(sequelize, Sequelize.DataTypes);
//const Achievement = require('./Achievement');
//const UserAchievement = require('./UserAchievement');

User.hasOne(HealthProfile, { foreignKey: 'user_id' });
User.hasMany(Goal, { foreignKey: 'user_id' });
User.hasMany(WorkoutLog, { foreignKey: 'user_id' });
User.hasMany(MealLog, { foreignKey: 'user_id' });
//User.belongsToMany(Achievement, { through: UserAchievement, foreignKey: 'user_id' });


HealthProfile.belongsTo(User, { foreignKey: 'user_id' });
Goal.belongsTo(User, { foreignKey: 'user_id' });


Exercise.belongsToMany(WorkoutPlan, {
  through: WorkoutPlanExercise,
  foreignKey: 'exercise_id',
  otherKey: 'plan_id'
});

WorkoutPlan.belongsToMany(Exercise, {
  through: WorkoutPlanExercise,
  foreignKey: 'plan_id',
  otherKey: 'exercise_id'
});


Exercise.hasMany(WorkoutLog, { foreignKey: 'exercise_id' });
WorkoutLog.belongsTo(User, { foreignKey: 'user_id' });
WorkoutLog.belongsTo(Exercise, { foreignKey: 'exercise_id' });


Food.belongsTo(UnitOfMeasurement, { foreignKey: 'serving_unit_id' });
Food.hasMany(MealLog, { foreignKey: 'food_id' });
UnitOfMeasurement.hasMany(Food, { foreignKey: 'serving_unit_id' });
MealLog.belongsTo(User, { foreignKey: 'user_id' });
MealLog.belongsTo(Food, { foreignKey: 'food_id' });
//Achievement.belongsToMany(User, { through: UserAchievement, foreignKey: 'achievement_id' });
 



const db = {
  sequelize,
  Sequelize,
  User,
  HealthProfile,
  Goal,
  WorkoutLog,
  WorkoutPlan,
  WorkoutPlanExercise,
  UnitOfMeasurement,
  Food,
  MealLog,
  Exercise
 // Achievement,
  //UserAchievement
  
};


module.exports = db;
