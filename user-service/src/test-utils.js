const request = require('supertest');
const { app } = require('./app.js');


const userData = {
    username: 'user',
    email: 'ld277@uowmail.edu.au',
    password: 'hellosadness',
    date_of_birth: '23-11-1997',
    gender: 'male',
    timezone: 'UTC'
}; 


async function createTestUser(userData) {
  const response = await request(app)
    .post('/api/users')
    .send(userData);
  return response;
}

async function createTestHealthData(userId, healthData = { height: 180, weight: 80 }) {
  const response = await request(app)
    .post(`/api/users/${userId}/health-profile`)
    .send(healthData);
  return response; 
}

async function createGoal(userId, goalData = {
  type: 'weight',
  target_value: 77, 
  timeline: '2025-12-31',
  description: 'weight loss'
}) {
  const response = await request(app)
    .post(`/api/users/${userId}/goals`)
    .send(goalData);
  return response;
}

async function setupUserWithGoal(userData, healthData, goalData) {
  const createUserResponse = await createTestUser(userData);
  const userId = createUserResponse.body.id; 

  await createTestHealthData(userId, healthData); 
  const createGoalResponse = await createGoal(userId, goalData);
  const goalId = createGoalResponse.body.id; 

  return { userId, goalId };
}

module.exports = { 
  createTestUser,
  userData,
  createTestHealthData,
  createGoal,
  setupUserWithGoal
};

