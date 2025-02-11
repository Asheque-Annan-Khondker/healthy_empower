const express = require('express');
const cors = require('cors'); 
const { encrypt_user_password } = require('./password-utils'); 

const app = express(); 
const port = 3000; 

app.use(express.json());
app.use(cors());

// we use a map until we implement sqlLite and ORM
const users = new Map();
const healthProfiles = new Map(); 

// TODO 1/2/25 write endpoint test, hash_password, ensure post validation, handle email validation, and handle duplicates


// create a user with non-health information 
app.post(
  '/api/users', (req, res) => {
    try {
      console.log('request body', req.body);
      // password is currently unhashed
      const { username, email, password, date_of_birth, gender, timezone } = req.body; 
      
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

      console.log("create new user", newUser);
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
        console.error("error creating user ", error)
        res.status(500).json({error: error.message });
        }
      }
);

app.listen(port, () => {
  console.log(`user-service listening on port ${port}`)
}); 


module.exports = { app, users };
