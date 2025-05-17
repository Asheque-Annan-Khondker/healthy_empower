const express = require('express');
const router = express.Router({ mergeParams: true });

module.exports = (mealLogController) => {
  router.post('/', mealLogController.createMealLog);
  router.get('/', mealLogController.get);
  router.put('/:logId', mealLogController.updateMealLog);
  router.delete('/:logId', mealLogController.deleteMealLog);
  
  return router;
};
