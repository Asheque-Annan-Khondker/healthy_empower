const express = require('express');
const router = express.Router();

module.exports = (foodController) => {
  router.get('/', foodController.getAllFoods);
  router.get('/:id', foodController.getFoodById);
  router.post('/', foodController.createFood);
  
  return router;
};
