const request = require('supertest');
const { app, users } = require('./app.js');
const { createTestUser, userData } = require('./test-utils.js');


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
      email: 'fakey',
      password: 'oops'
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

  test('should update last login timestamp when user logs in', async() => {
    await createTestUser(userData);

    const targetUser = Array.from(users.values())
      .find(user => user.email === userData.email);

    const originalLoginTimeStamp = targetUser.last_login;

    // Wait for differnt timestamp
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await request(app)
      .post('/api/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    const updatedUser = Array.from(users.values())
      .find(user => user.email === userData.email);

    expect(updatedUser.last_login).not.toEqual(originalLoginTimeStamp);
    expect(updatedUser.last_login.getTime()).toBeGreaterThan(originalLoginTimeStamp.getTime());
  });
});


describe('Token refresh endpoint', () => {
  let userId;
  let accessToken;
  let refreshToken; 

  beforeEach(async() => {
    users.clear();
    await createTestUser(userData);

    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    userId = loginResponse.body.user.id;
    accessToken = loginResponse.body.token; 
    refreshToken = loginResponse.body.refreshToken;
  });

  test('should successfully refresh tokens with valid refresh token', async() => {
    const response = await request(app)
      .post('/api/refresh-token')
      .send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refreshToken');
    expect(response.body.token).not.toBe(accessToken);
    expect(response.body.refreshToken).not.toBe(refreshToken);
  });

  test('should fail refresh with missing token', async() => {
    const response = await request(app)
      .post('/api/refresh-token')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Refresh token is required'); 
  });

  test('should fail refresh with invalid refresh token', async() => {
    const response = await request(app)
      .post('/api/refresh-token')
      .send({ refreshToken: 'invalid-token' }); 

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Refresh token is required'); 
  });

  test('should invalidate old refresh token after successful refresh (token rotation)', async() => {
    const firstRefresh = await request(app)
      .post('/api/refresh-token')
      .send({ refreshToken });

    expect(firstRefresh.status).toBe(200);

    const secondRefresh = await request(app)
      .post('/api/refresh-token')
      .send({ refreshToken });

    expect(secondRefresh.status).toBe(401);
    expect(secondRefresh.body).toHaveProperty('error', 'Invalid refresh token');
  });

  test('should fail when user account is deleted but refresh token is valid', async() => {
    await request(app)
      .delete(`/api/users/${userId}`);

    const response = await request(app)
      .post('/api/refresh-token')
      .send({ refreshToken });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'User not found');
  })
});




