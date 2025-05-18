'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('achievements', [
      // Workout achievements
      {
        name: 'First Workout',
        description: 'Complete your first workout',
        required_count: 1,
        type: 'workout'
      },
      {
        name: 'Workout Enthusiast',
        description: 'Complete 10 workouts',
        required_count: 10,
        type: 'workout'
      },
      {
        name: 'Fitness Fanatic',
        description: 'Complete 100 workouts',
        required_count: 100,
        type: 'workout'
      },
      
      // Meal logging achievements
      {
        name: 'First Meal Logged',
        description: 'Track your first meal',
        required_count: 1,
        type: 'meal'
      },
      {
        name: 'Nutrition Tracker',
        description: 'Track 10 meals',
        required_count: 10,
        type: 'meal'
      },
      {
        name: 'Nutrition Master',
        description: 'Track 100 meals',
        required_count: 100,
        type: 'meal'
      },
      
      // Goal achievements
      {
        name: 'Goal Setter',
        description: 'Create your first fitness goal',
        required_count: 1,
        type: 'goal'
      },
      {
        name: 'Goal Achiever',
        description: 'Achieve two fitness goals',
        required_count: 2,
        type: 'goal'
      },
      {
        name: 'Goal Master',
        description: 'Achieve five fitness goals',
        required_count: 5,
        type: 'goal'
      },
      
      // Streak achievements
      {
        name: '3-Day Streak',
        description: 'Work out for 3 consecutive days',
        required_count: 3,
        type: 'streak'
      },
      {
        name: 'Weekly Warrior',
        description: 'Work out for 7 consecutive days',
        required_count: 7,
        type: 'streak'
      },
      
      // Weight achievements
      {
        name: 'Weight Goal Achieved',
        description: 'Reach a weight goal',
        required_count: 1,
        type: 'weight'
      },
      
      // Future shop achievements (placeholder for future implementation)
      {
        name: 'First Purchase',
        description: 'Make your first purchase in the shop',
        required_count: 1,
        type: 'shop'
      },
      
      // Future currency achievements (placeholder for future implementation)
      {
        name: 'Money Maker',
        description: 'Earn 5000 fitness currency',
        required_count: 5000,
        type: 'currency'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('achievements', null, {});
  }
};