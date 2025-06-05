 const express = require('express');
const router = express.Router();

module.exports = (userController) => {
  // User routes
  router.post('/', userController.createUser);
  router.get('/', userController.get);
  router.get('/by-email', userController.getUserByEmail);
  router.get('/leaderboard/currency', userController.getLeaderboard);
  router.get('/leaderboard/streaks', userController.getStreakLeaderboard);
  router.get('/:id', userController.getUserById);
  router.delete('/:id', userController.deleteUser);
  router.patch('/:id/currency', userController.updateUserCurrency);
  router.get('/:id/currency', userController.getUserCurrency);
  router.get('/:id/streak', userController.getUserStreak);

  return router;
};
