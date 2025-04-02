const express = require('express');
const cors = require('cors'); 
const path = require('path'); 
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '.env') }); 

const UserController = require('./controllers/userController');
const HealthProfileController = require('./controllers/healthProfileController');
const GoalController = require('./controllers/goalController');
const AuthController = require('./controllers/authController');

const userRoutesFactory = require('./routes/userRoutes');
const healthProfileRoutesFactory = require('./routes/healthRoutes');
const goalRoutesFactory = require('./routes/goalRoutes');
const authRoutesFactory = require('./routes/authRoutes');

const app = express(); 
const port = 3001; 

app.use(express.json());
app.use(cors());
const users = new Map();
// we use a map until we implement sqlLite and ORM
/* 
 * fuck comments lmao 
 * goals map structure Map<userId, Array<goals>> 
 * should mimic one to many structure to be seen in the ORM 
 */ 
const userController = new UserController();
const healthProfileController = new HealthProfileController();
const goalController = new GoalController();
const authController = new AuthController(users); 

app.use('/api/users', userRoutesFactory(userController));
app.use('/api/users', healthProfileRoutesFactory(healthProfileController));
app.use('/api/users', goalRoutesFactory(goalController));
app.use('/api', authRoutesFactory(authController));


if (require.main === module) {
  app.listen(port, () => {
  console.log(`user-service listening on port ${port}`)
}); 
}


module.exports = { app, users };
