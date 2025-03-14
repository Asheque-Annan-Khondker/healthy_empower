const express = require('express');
const cors = require('cors'); 


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

// we use a map until we implement sqlLite and ORM
const users = new Map();
const healthProfiles = new Map(); 
/* 
 * fuck comments lmao 
 * goals map structure Map<userId, Array<goals>> 
 * should mimic one to many structure to be seen in the ORM 
 */ 
const goals = new Map();

const userController = new UserController(users); 
const healthProfileController = new HealthProfileController(users, healthProfiles);
const goalController = new GoalController(users, healthProfiles, goals);
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


module.exports = { app, users, healthProfiles, goals };
