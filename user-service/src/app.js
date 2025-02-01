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
      // password is currently unhashed
      const { id,username, email, password, date_of_birth, gender, timezone } = req.body; 
      
      
      const newUser = { 
         id: Date.now().toString(), 
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
      const { password_hash: _, ...userResponse} = newUser; 

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

