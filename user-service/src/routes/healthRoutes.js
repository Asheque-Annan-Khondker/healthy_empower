 const express = require('express');
const router = express.Router();

module.exports = (healthProfileController) => {
  // Health profile routes
  router.post('/:id/health-profile', healthProfileController.createHealthProfile);
  router.get('/:id/health-profile', healthProfileController.getHealthProfile);
  router.put('/:id/health-profile', healthProfileController.updateHealthProfile);

  
  return router;
};
