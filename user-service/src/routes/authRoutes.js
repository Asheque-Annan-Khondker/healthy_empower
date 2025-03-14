const express = require('express');
const router = express.Router(); 


module.exports = (authController) => {
  router.post('/login', authController.login);
  router.post('/refresh-token', authController.refreshToken);

  return router; 
};
