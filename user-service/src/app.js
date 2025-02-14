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

app.listen(port, () => {
  console.log(`user-service listening on port ${port}`)
}); 


module.exports = { app, users };
