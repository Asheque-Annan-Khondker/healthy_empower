const express = require('express');
const router = express.Router();

module.exports = (goalController) => {
  // Goal routes
  router.post('/:userId/goals', goalController.createGoal);
  router.get('/:userId/goals', goalController.get);
  router.get('/:userId/goals/:goalId', goalController.getGoalById);
  router.put('/:userId/goals/:goalId', goalController.updateGoal);
  router.delete('/:userId/goals/:goalId', goalController.deleteGoal);
  
  return router;
};
