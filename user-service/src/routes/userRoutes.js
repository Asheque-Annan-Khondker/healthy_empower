 const express = require('express');
const router = express.Router();

module.exports = (userController) => {
  // User routes
  router.post('/', userController.createUser);
  router.get('/', userController.getAllUsers);
  router.get('/:id', userController.getUserById);
  router.delete('/:id', userController.deleteUser);

  return router;
};
