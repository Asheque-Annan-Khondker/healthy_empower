const express = require('express');
const cors = require('cors'); 
const { encrypt_user_password, isValidEmail } = require('./password-utils'); 

const app = express(); 
const port = 3000; 

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


// TODO make get user endpoint and delete user endpoint, tests, and also user health data endpoint. 

// create user helper functions in order to clean up /api/users POST 
function hasRequiredFields(userData) { 
    const { username, email, password, date_of_birth, gender, timezone } = userData; 
    return username && email && password && date_of_birth && gender && timezone; 
}

const isEmailAlreadyRegistered = (email, users) => {
  const existingUsers = Array.from(users.values());
  return existingUsers.some(user => user.email === email);
} 

function validateHealthData(healthData) {
  const { height, weight } = healthData;
  
  const HAS_MISSING_FIELDS = !height || !weight; 
  const HAS_INVALID_VALUES = height <= 0 || weight <= 0; 

  if (HAS_MISSING_FIELDS) {
    return { isValid: false, error: 'Missing required fields' }; 
  }

  if (HAS_INVALID_VALUES) {
    return { isValid: false, error: 'Invalid Height or Weight Values' }; 
  } 

  return { isValid: true };  
}


function validateGoalData(goalData, hasHealthProfile) {
  const { type, target_value, timeline, description } = goalData;

  const HAS_MISSING_FIELDS = !type || !target_value || !timeline || !description;
  const HAS_NO_HEALTH_PROFILE = !hasHealthProfile; 
  const INVALID_GOAL_TYPES = !['weight', 'activity', 'xpgoal', 'stepgoal'].includes();
  const HAS_NEGATIVE_TARGET = target_value <= 0;
  const TIMELINE_DATE = new Date(timeline);
  const CURRENT_DATE = new Date();
  const IS_PAST_OR_PRESENT_DATE = TIMELINE_DATE <= CURRENT_DATE; 

  if (HAS_MISSING_FIELDS) {

  }

  if (HAS_NO_HEALTH_PROFILE) {

  }

  if (INVALID_GOAL_TYPES) {

  }

  if (HAS_NEGATIVE_TARGET) {

  }

  if (IS_PAST_OR_PRESENT_DATE) {

  }

  return { isValid: true }; 


}

// create a user with non-health information 
app.post(
  '/api/users', (req, res) => {
    try {
      console.log('request body', req.body);
      // password is currently unhashed
      const { username, email, password, date_of_birth, gender, timezone } = req.body; 
      
      if (!hasRequiredFields(req.body)) {
        return res.status(400).json({error: 'Missing Required Fields'});
      }
      
      if (!isValidEmail(email)) {
        return res.status(400).json({error: 'Invalid Email Format'});
      }

      if (isEmailAlreadyRegistered(req.body.email, users)) {
        return res.status(409).json({error: 'Email Already Exists'});
      }


      const id = Date.now().toString();
      
      const newUser = { 
         id, 
         username, 
         email, 
         password: encrypt_user_password(password),
         date_of_birth,
         gender, 
         timezone, 
         created_at: new Date(), 
         last_login: new Date()
       }; 

      users.set(id, newUser); 
      // omit password_hash from response
      const userResponse = {
        id: newUser.id, 
        username: newUser.username,
        email: newUser.email,
        date_of_birth: newUser.date_of_birth,
        gender: newUser.gender, 
        timezone: newUser.timezone, 
        created_at: newUser.created_at,
        last_login: newUser.last_login
      };

      // send the data back 
      res.status(201).json(userResponse);
      } catch (error) {
        res.status(500).json({error: error.message });
        }
      }
);

app.get('/api/users', (req, res) => {
  try {
    const userList = Array.from(users.values()).map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
    }));

    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({error: error.message });
  }
})


app.get('/api/users/:id', (req, res) => {
  try {
    const userId = req.params.id; 
    console.log('looking for user with ID: ', userId);
    const user = users.get(userId);
    console.log('Found user', user);

    if (!user) {
      return res.status(404).json({error: 'User Not Found' });
    }

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email
    }

    res.status(200).json(userResponse);
  } catch (error) {
    console.error('error: ', error);
    res.status(500).json({error: error.message });
  }
})

app.delete('/api/users/:id', (req, res) => {
  try {
    const userId = req.params.id; 
    const user = users.get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found'});
    }

    users.delete(userId);

    res.status(200).json({ message: 'User successfully deleted'});
  } catch (error) {
    console.error('error: ', error); 
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`user-service listening on port ${port}`)
}); 


app.post('/api/users/:id/health-profile', (req, res) => {
  try {
    const userId = req.params.id; 
    const healthData = req.body;
    
    const user = users.get(userId); 
    if (!user) {
      return res.status(404).json({error: 'User not found'}); 
    }

    const validation = validateHealthData(healthData);
    if (!validation.isValid) {
      return res.status(400).json({error: validation.error}); 
    }

    const healthProfile = {
      user_id: userId, 
      height: healthData.height,
      weight: healthData.weight,
      created_at: new Date()
    };
     
    healthProfiles.set(userId, healthProfile);
    res.status(201).json(healthProfile);
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
});






module.exports = { app, users, healthProfiles, goals };
