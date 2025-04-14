const express = require('express');
const router = express.Router();

module.exports = (unitOfMeasurementController) => {
  router.get('/', unitOfMeasurementController.getAllUnits);
  
  return router;
};
