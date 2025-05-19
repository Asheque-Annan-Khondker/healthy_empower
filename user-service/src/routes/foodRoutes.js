const express = require('express');
const router = express.Router();

module.exports = (foodController) => {
  console.log("Route hit!")
  router.get('/', foodController.get);
  router.get('/:food_id', foodController.getFoodById);
  router.post('/', foodController.createFood);
  
  return router;
};
