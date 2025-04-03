const express = require('express');
const cors = require('cors'); 
const path = require('path'); 
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '.env') }); 

const UserController = require('./controllers/userController');
const HealthProfileController = require('./controllers/healthProfileController');
const GoalController = require('./controllers/goalController');
const AuthController = require('./controllers/authController');
const FoodController = require('./controllers/foodController');
const MealLogController = require('./controllers/mealLogController');
const UnitOfMeasurementController = require('./controllers/unitOfMeasurementController');


const userRoutesFactory = require('./routes/userRoutes');
const healthProfileRoutesFactory = require('./routes/healthRoutes');
const goalRoutesFactory = require('./routes/goalRoutes');
const authRoutesFactory = require('./routes/authRoutes');
const foodRoutesFactory = require('./routes/foodRoutes');
const mealLogRoutesFactory = require('./routes/mealLogRoutes');
const unitRoutesFactory = require('./routes/unitRoutes');


const app = express(); 
const port = 3001; 
const users = new Map();
app.use(express.json());
app.use(cors());

const userController = new UserController();
const healthProfileController = new HealthProfileController();
const goalController = new GoalController();
const authController = new AuthController(users); 
const foodController = new FoodController();
const mealLogController = new MealLogController();
const unitOfMeasurementController = new UnitOfMeasurementController();

app.use('/api/users', userRoutesFactory(userController));
app.use('/api/users', healthProfileRoutesFactory(healthProfileController));
app.use('/api/users', goalRoutesFactory(goalController));
app.use('/api', authRoutesFactory(authController));


app.use('/api/foods', foodRoutesFactory(foodController));
app.use('/api/users/:userId/meal-logs', mealLogRoutesFactory(mealLogController));
app.use('/api/units', unitRoutesFactory(unitOfMeasurementController)); 

if (require.main === module) {
  app.listen(port, () => {
  console.log(`user-service listening on port ${port}`)
}); 
}


module.exports = { app, users };
