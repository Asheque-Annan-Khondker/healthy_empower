const express = require('express');
const cors = require('cors'); 
const { encrypt_user_password, isValidEmail } = require('./password-utils'); 
const { validateGoalData, validateHealthData, isEmailAlreadyRegistered, hasRequiredFields } = require('./validation.js'); 

// TODO 25/2/25 lets have a great day :). 
// create GET, PUT endpoint for health profile and tests
// create GET, GET goal/:id, PUT goal, delete goal and tests 
// write tests for a login endpoint w/ middleware support, JWT token
// lets get it 930 - 1230

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
      'user-id': userId, 
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



app.get('/api/users/:id/health-profile', (req, res) => {
  try {
    const userId = req.params.id; 

    const user = users.get(userId); 
    if (!user) {
      return res.status(404).json({ error: "User not found"});
    }
  
  
  const healthProfile = healthProfiles.get(userId);
  if (!healthProfile) {
    return res.status(404).json({ error: "health profile not found"});
  }

  const healthProfileResponse = {
    'user-id': userId, 
    height: healthProfile.height,
    weight: healthProfile.weight,
    created_at: healthProfile.created_at
  };

    res.status(200).json(healthProfileResponse)

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/users/:id/goals', (req, res) => {
  try {
    const userId = req.params.id;
    const goalData = req.body;

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hasHealthProfile = healthProfiles.has(userId);
    const validation = validateGoalData(goalData, hasHealthProfile);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const goalId = Date.now().toString();
    const newGoal = {
      id: goalId,
      'user-id': userId,
      type: goalData.type,
      target_value: goalData.target_value,
      timeline: goalData.timeline,
      description: goalData.description,
      created_at: new Date()
    };

    // Initialize array if first goal
    if (!goals.has(userId)) {
      goals.set(userId, []);
    }
    goals.get(userId).push(newGoal);

    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.put(`/api/users/:id/health-profile`, (req, res) => {
  try {
    const userId = req.params.id; 
    const healthData = req.body; 

    const user = users.get(userId); 
    if (!user) {
      return res.status(404).json({ error: 'User not found'});
    }

    const existingHealthProfile = healthProfiles.get(userId); 
    if (!existingHealthProfile) {
      return res.status(404).json({ error: 'Health profile not found'});
    }

    const validation = validateHealthData(healthData); 
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error }); 
    }

    const updatedHealthProfile = {
      'user-id': userId, 
      height: healthData.height,
      weight: healthData.weight,
      created_at: existingHealthProfile.created_at,
      updated_at: new Date()
    };

    healthProfiles.set(userId, updatedHealthProfile);

    res.status(200).json({
      'user-id': userId,
      height: updatedHealthProfile.height,
      weight: updatedHealthProfile.weight,
      created_at: updatedHealthProfile.created_at, // existingHealthProfile.created_at referenced
      updated_at: updatedHealthProfile.updated_at
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.get('/api/users/:id/goals', (req, res) => {
  try {
    const userId = req.params.id;

    const user = users.get(userId); 
    if (!user) {
      return res.status(404).json({ error: 'User not found'});
    }

    if (!goals.has(userId)) {
      return res.status(200).json([]);
    }
    
    const userGoals = goals.get(userId);

    res.status(200).json(userGoals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:userId/goals/:goalId', (req, res) => {
  try {
    const userId = req.params.userId;
    const goalId = req.params.goalId;


    const user = users.get(userId); 
    if (!user) {
      return res.status(404).json({ error: 'User not found'})
    }

    const userGoals = goals.get(userId) || [];
    const goal = userGoals.find(g => g.id == goalId); 

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found'}); 
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


module.exports = { app, users, healthProfiles, goals };
