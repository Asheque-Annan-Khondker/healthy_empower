const express = require('express');
const router = express.Router();

module.exports = (goalController) => {
  // Goal routes
  router.post('/:id/goals', goalController.createGoal);
  router.get('/:id/goals', goalController.getAllGoals);
  router.get('/:userId/goals/:goalId', goalController.getGoalById);
  router.put('/:userId/goals/:goalId', goalController.updateGoal);
  router.delete('/:userId/goals/:goalId', goalController.deleteGoal);
  
  return router;
};
