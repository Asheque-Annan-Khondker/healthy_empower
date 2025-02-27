const request = require('supertest');
const { app, users } = require('.../../user-service/src/app.js');
const { createTestUser, userData } = require('./user.test.js');


//TODO 28/2/25 - 3/2/25
// 1/2/25
// - Write tests for auth
//    - A login endpoint with JWT token
//    - refresh-token endpoint for the JWT
//    - forgot-password / reset-password endpoint
//    - change-password endpoint
// 2/2/25
//  - Write endpoints for above tests and login logic
// 3/2/25
//  - Make documentation for endpoints OpenAPI standard
//

describe('Authentication endpoints user logs in', () => {
  beforeEach(() => { 
    users.clear(); 
  });

  test('should successfully log in with valid credentials', async() => { 
    await createTestUser(userData);

    const loginData = {
      email: userData.email, 
      password: userData.password
    };

    const response = await request(app)
      .post('/api/login')
      .send(loginData); 

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).not.toHaveProperty('password'); 
  });

  test('should return 401 when password is incorrect', async() => {
    await createTestUser(userData);

    const loginData = {
      email: userData.email,
      password: 'wrong password'
    }

    const response = await request(app)
      .post('/api/login')
      .send(loginData); 

    expect(response.status).toBe(401); 
    expect(response.body).toHaveProperty('error', 'Invalid credentials'); 
  });

  test('should return 401 when user does not exist', async() => {
    const loginData = { 
      email = 'fakey',
      password = 'oops'
    };

    const response = await request(app)
      .post('/api/login')
      .send(loginData); 

    expect(response.status).toBe(401); 
    expect(response.body).toHaveProperty('error', 'Invalid credentials'); 
  });

  test('should return 400 when required fields are missing', async() => { 
    let response = await request(app)
      .post('/api/login')
      .send({ email: userData.email }); // no password!!

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email and password are required');

    response = await request(app)
      .post('/api/login')
      .send({ password: 'dog' }); // no email!

    expect(response.status).toBe(400); 
    expect(response.body).toHaveProperty('error', 'Email and password are required');

    response = await request(app)
      .post('/api/login')
      .send({}) // no nothing!

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email and password are required');
  });

  test('should update last login timestamp when user logs in', async() => {});
});
