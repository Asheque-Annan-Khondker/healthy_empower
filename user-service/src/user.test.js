const request = require('supertest');
const { app, users, healthProfiles, goals } = require('../../user-service/src/app.js')

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

describe('POST /api/users', () => {
  beforeEach(() => {
    users.clear();
  });

  test('should successfully create a new user with valid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(userData);


    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(userData.username);
    expect(response.body).not.toHaveProperty('password');
  });

  test('should return 400 when email is invalid', async() => { 

    const userData = {
    username: 'user',
    email: 'ld277uowmail.edu.au',
    password: 'hellosadness',
    date_of_birth: '23-11-1997',
    gender: 'male',
    timezone: 'UTC'
};



    const response = await request(app)
      .post('/api/users')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('should return 400 when required fields are missing', async() => {
    const userData = {
      username: 'atestuser'
      // missing fields not added 
    }

    const response = await request(app)
      .post('/api/users')
      .send(userData)
    expect(response.status).toBe(400)
    expect(response.body.error).toContain('Missing Required Fields');
  })

test('should return 409 when email already exists', async() => {
  await request(app)
    .post('/api/users')
    .send(userData);

  // try to make second user
  const response = await request(app)
    .post('/api/users')
    .send(userData);

  expect(response.status).toBe(409);
  expect(response.body.error).toContain('Email Already Exists');

  });
});


describe('GET /api/users', () => {
  beforeEach(() => {
    users.clear();
  });
  
  test('should return an empty array when no users exist', async() => {
    const response = await request(app)
      .get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  
  test('should return all users without the password, date_of_birth, gender, and health information', async() => {
    const testUsers = [
      {
        username: 'user',
        email: 'ld277@uowmail.edu.au',
        password: 'hellosadness',
        date_of_birth: '23-11-1997',
        gender: 'male',
        timezone: 'UTC'
      },
      {
        username: 'lue',
        email: 'lukedunn011@gmail.com',
        password: 'whatsmypass',
        date_of_birth: '25-05-2004',
        gender: 'male',
        timezone: 'UTC'
      }
    ]
    for (const userData of testUsers) {
      await request(app)
         .post('/api/users')
         .send(userData); 
    }

    const response = await request(app)
      .get('/api/users');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); 
    expect(response.body.length).toBe(2);
    response.body.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).not.toHaveProperty('password');
    });


  });
});

describe('GET /api/users/:id', () => {
  beforeEach(() => {
    users.clear();
  })

  test('should return specific user when valid id is provided', async() => {
    const createResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createResponse.body.id; 

    const response = await request(app)
      .get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId); 
    expect(response.body).toHaveProperty('username', userData.username); 
    expect(response.body).toHaveProperty('email', userData.email);
    expect(response.body).not.toHaveProperty('password'); 
  });

  test('should return 404 when no user found', async() => {
    const response = await request(app)
      .get('/api/users/xyz');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  })
})

describe('DELETE /api/users/:id', () => { 
  beforeEach(() => {
    users.clear(); 
  });

  test('should successfully delete an existing user', async() => { 
    
    const createResponse = await request(app)
      .post('/api/users')
      .send(userData)

    const userId = createResponse.body.id; 

    const deleteResposne = await request(app)
      .delete(`/api/users/${userId}`);

    expect(deleteResposne.status).toBe(200);
    expect(deleteResposne.body).toHaveProperty('message', 'User successfully deleted');

    const getResponse = await request(app)
      .get(`/api/users/${userId}`); 

    expect(getResponse.status).toBe(404); 
  }); 

  test('should return 404 when trying to delete a fake user', async() => {
    const fakeUserId = 'notreal';

    const deleteResponse = await request(app)
      .delete(`/api/users/${fakeUserId}`);

    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body).toHaveProperty('error', 'User not found');
  });
});

describe('POST /api/users/:id/health-profile', () => {
  beforeEach(() => {
    users.clear();
    healthProfiles.clear();
  });
  
  test('should create health profile for existing user', async () => {
  const createUserResponse = await request(app)
    .post('/api/users')
    .send(userData);
  
  const userId = createUserResponse.body.id; 

  const healthData = {
    height: 180.5,
    weight: 82.3
  };
  
  const response = await request(app)
    .post(`/api/users/${userId}/health-profile`)
    .send(healthData);
  

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('user-id', userId);
  expect(response.body).toHaveProperty('height', healthData.height);
  expect(response.body).toHaveProperty('weight', healthData.weight);  
  });

  test('should return 404 when user does not exist', async() => {
    const fakeUserId = 'notreal'; 

    const healthData = { 
      height: 180, 
      weight: 82.5
    };

    const response = await request(app)
      .post(`/api/users/${fakeUserId}/health-profile`)
      .send(healthData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  test('should return 400 when required fields are missing', async() => {
      const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createUserResponse.body.id; 

    const invalidHealthData = { 
      height: 179.5 
      // weight: victim weight
    }

    const response = await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send(invalidHealthData);

    expect(response.status).toBe(400);  
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  test('return 400 when field values are invalid', async() => { 
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createUserResponse.body.id; 

    const invalidHealthData = { 
      height: -179,
      weight: -80 
    };

    const response = await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send(invalidHealthData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid Height or Weight Values'); 
  });
});

describe('POST /api/users/:id/goals', () => {
  beforeEach(() => {
    users.clear();
    healthProfiles.clear(); 
    goals.clear(); 
  });
  
  test('should create a new goal for an existing user', async() => {
  const createUserResponse = await request(app)
    .post('/api/users')
    .send(userData); 

  const userId = createUserResponse.body.id; 

  const healthData = { 
    height: 180, 
    weight: 80
  };

  await request(app)
    .post(`/api/users/${userId}/health-profile`)
    .send(healthData)



  const goalData = {
    type: `weight`,
    target_value: 75, 
    timeline: '2025-12-31',
    description: 'Weight loss goal'
  };

  const response = await request(app)
    .post(`/api/users/${userId}/goals`)
    .send(goalData);

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  expect(response.body).toHaveProperty('user-id', userId);
  expect(response.body).toHaveProperty('type', goalData.type);
  expect(response.body).toHaveProperty('target_value', goalData.target_value);
  expect(response.body).toHaveProperty('timeline', goalData.timeline);
  expect(response.body).toHaveProperty('description', goalData.description);
  expect(response.body).toHaveProperty('created_at');
  });

  test('should return 404 when user does not exist', async() => {
    
    const fakeUserId = 'fuckaduck';
    const goalData = {
      type: `weight`,
      target_value: 75,
      timeline: '2026-01-01',
      description: 'Weight loss goal'
    };

    const response = await request(app)
      .post(`/api/users/${fakeUserId}/goals`)
      .send(goalData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
  
  test('should return 400 when required fields are missing', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createUserResponse.body.id; 

    const invalidGoalData = {
      type: 'weight',
      // target_value: 75
      timeline: '2026-01-01'
    };

    const response = await request(app)
      .post(`/api/users/${userId}/goals`)
      .send(invalidGoalData);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  test('should return 400 when goal target value fields are invalid', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createUserResponse.body.id; 

    await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send({ height: 180, weight: 80});
    
    const invalidGoals = [
      {
        type: 'weight',
        target_value: -75,
        timeline: '2025-12-31',
        description: 'target value negative'
      },
      {
        type: 'activity',
        target_value: -75,
        timeline: '2025-12-31',
        description: 'activity target value negative'
      },
      {
        type: 'xpgoal',
        target_value: -20,
        timeline: '2025-12-31',
        description: 'xp target_value is negative'
      },
      {
        type: 'stepgoal',
        target_value: -20, 
        timeline: '2025-12-31',
        description: 'step goal is negative'
      }
    ];

    for (const invalidGoal of invalidGoals) {
      const response = await request(app) 
        .post(`/api/users/${userId}/goals`)
        .send(invalidGoal);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid goal value');

    }

  });

  test('should return 400 when goal type is invalid', async() => {
    const createUserResponse = await request(app)
      .post(`/api/users`)
      .send(userData);

    const userId = createUserResponse.body.id; 

    await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send({ height: 180, weight: 80});


    const invalidGoalData = {
      type: 'bad_goal',
      target_value: 75, 
      timeline: '2025-12-31',
      description: 'Invalid goal type'
    };

    const response = await request(app)
      .post(`/api/users/${userId}/goals`)
      .send(invalidGoalData)

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid goal type. Goal must be: weight, activity, xpgoal, or stepgoal');
  });

  test('should return 400 when timeline is not a future date', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createUserResponse.body.id;

    await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send({ height: 180, weight: 80})

    const pastGoalData = {
      type: 'weight',
      target_value: 75,
      timeline: '2003-6-05', // past date
      description: 'weight goal'
    };

    const pastDataResponse = await request(app)
      .post(`/api/users/${userId}/goals`)
      .send(pastGoalData);

    expect(pastDataResponse.status).toBe(400);
    expect(pastDataResponse.body).toHaveProperty('error', 'Timeline must be a future date');

    // now test current date against it 
    const currentDate = new Date().toISOString().split('T')[0];
    const currentGoalData = {
      type: 'weight',
      target_value: 85,
      timeline: currentDate,
      description: 'weight goal'      
    };

    const currentDateResponse = await request(app)
      .post(`/api/users/${userId}/goals`)
      .send(currentGoalData);

    expect(currentDateResponse.status).toBe(400);
    expect(currentDateResponse.body).toHaveProperty('error', 'Timeline must be a future date');
  });

  test('should return 400 when creating goal without health profile', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData); 

    const userId = createUserResponse.body.id; 

    const goalData = {
      type: 'weight',
      target_value: 85, 
      timeline: '2025-12-31',
      description: 'weight loss'
    };

    const response = await request(app)
      .post(`/api/users/${userId}/goals`)
      .send(goalData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Health profile required before setting goals');
  });
});


describe('GET /api/users/:id/health-profile', () => {
  beforeEach(() => {
    users.clear();
    healthProfiles.clear();
  });

  test('should successfully retrieve existing health profile', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);


    const userId = createUserResponse.body.id; 

    const healthData = {
      height: 179,
      weight: 82.5
    };

    await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send(healthData); 

    const response = await request(app) 
      .get(`/api/users/${userId}/health-profile`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user-id', userId); 
    expect(response.body).toHaveProperty('height', healthData.height);
    expect(response.body).toHaveProperty('weight', healthData.weight);  
  });


  test('should return 404 when health profile does not exist', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData); 

    const userId = createUserResponse.body.id; 

    const response = await request(app)
      .get(`/api/users/${userId}/health-profile`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'health profile not found'); 
  });

  test('should return 404 when user does not exist', async() => {
    const fakeUserId = 'fuckthislmao'; 

    const response = await request(app)
      .get(`/api/users/${fakeUserId}/health-profile`);

    expect(response.status).toBe(404); 
    expect(response.body).toHaveProperty('error', "User not found"); 
  });
});


describe('PUT /api/users/:id/health-profile', () => {
  beforeEach(() => {
    users.clear();
    healthProfiles.clear();
  });

  test('should successfully update existing health profile', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createUserResponse.body.id; 

    const initialHealthData = { 
      height: 180.5,
      weight: 82.3
    };

    await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send(initialHealthData);

    const updatedHealthData = {
      height: 180.5, 
      weight: 80.1 
    };

    const response = await request(app) 
      .put(`/api/users/${userId}/health-profile`)
      .send(updatedHealthData); 

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user-id', userId);
    expect(response.body).toHaveProperty('height', updatedHealthData.height);
    expect(response.body).toHaveProperty('weight', updatedHealthData.weight);

    const getResponseFromUpdatedHealthProfile = await request(app)
      .get(`/api/users/${userId}/health-profile`);

    expect(getResponseFromUpdatedHealthProfile.body.height).toBe(updatedHealthData.height); 
    expect(getResponseFromUpdatedHealthProfile.body.weight).toBe(updatedHealthData.weight);
  });

  test('should return 404 when user does not exist', async() => {
    const fakeUserId = 'lmao'; 

    const updatedHealthData = {
      height: 175.0,
      weight: 9
    };

    const response = await request(app)
      .put(`/api/users/${fakeUserId}/health-profile`)
      .send(updatedHealthData);

    expect(response.status).toBe(404); 
    expect(response.body).toHaveProperty('error', 'User not found'); 
  });


  test('should return 404 when user exists but health-profile does not', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData); 

    const userId = createUserResponse.body.id; 

    const updateHealthData = { 
      height: 175.0,
      weight: 9
    };

    const response = await request(app)
      .put(`/api/users/${userId}/health-profile`)
      .send(updateHealthData); 

    expect(response.status).toBe(404); 
    expect(response.body).toHaveProperty('error', 'Health profile not found'); 
  });

  test('should return 400 when input validation fails with negative values', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createUserResponse.body.id; 

    const initialHealthData = {
      height: 180.5,
      weight: 82
    };

    await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send(initialHealthData);

    const invalidHeightHealthData = {
      height: -175,
      weight: 70.5
    }; 

    let response = await request(app)
      .put(`/api/users/${userId}/health-profile`)
      .send(invalidHeightHealthData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid Height or Weight Values');

    const invalidWeightHealthData = {
      height: 175,
      weight: -70
    }; 

    response = await request(app)
      .put(`/api/users/${userId}/health-profile`)
      .send(invalidWeightHealthData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid Height or Weight Values');
  });

  test('should return 400 when fields are missing', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData); 

    const userId = createUserResponse.body.id;

    const initialHealthData = { 
      height: 180.5,
      weight: 82
    };

    await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send(initialHealthData);

    const missingFieldsHealthData = { 
      weight: 75
    }; 

    const response = await request(app)
      .put(`/api/users/${userId}/health-profile`)
      .send(missingFieldsHealthData); 

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields'); 
  })
});

describe('GET /api/users/:id/goals', () => {
  beforeEach(() => {
    users.clear();
    healthProfiles.clear();
    goals.clear();
  });

  test('should successfully retrieve all goals for a user', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createUserResponse.body.id; 

    await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send({height: 180, weight: 80}); 

    const goalOneData = { 
      type: 'weight',
      target_value: 75,
      timeline: '2025-12-31',
      description: 'lose weight'
    }; 

    const goalTwoData = { 
      type: 'activity',
      target_value: 300, 
      timeline: '2025-12-31',
      description: 'activity minutes goal'
    };

    await request(app)
      .post(`/api/users/${userId}/goals`)
      .send(goalOneData);

    await request(app)
      .post(`/api/users/${userId}/goals`)
      .send(goalTwoData); 
    
    const response = await request(app)
      .get(`/api/users/${userId}/goals`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);

    const goalTypes = response.body.map(goal => goal.type);
    expect(goalTypes).toContain('weight');
    expect(goalTypes).toContain('activity');
    
    // check goal structure
    response.body.forEach(goal => {
      expect(goal).toHaveProperty('id');
      expect(goal).toHaveProperty('user-id', userId);
      expect(goal).toHaveProperty('type');
      expect(goal).toHaveProperty('target_value');
      expect(goal).toHaveProperty('timeline');
      expect(goal).toHaveProperty('description');
      expect(goal).toHaveProperty('created_at');
    });
  });

test('should return empty array when user has no goals', async() => {
  const createUserResponse = await request(app)
    .post(`/api/users/`)
    .send(userData)

  const userId = createUserResponse.body.id;

  const response = await request(app)
    .get(`/api/users/${userId}/goals`);
    
  expect(response.status).toBe(200); 
  expect(Array.isArray(response.body)).toBe(true); 
  expect(response.body.length).toBe(0); 
});

test('should return 404 when user does not exist', async() => {
  const fakeUserId = 'sad'; 

  const response = await request(app)
    .get(`/api/users/${fakeUserId}/goals`);

  expect(response.status).toBe(404); 
  expect(response.body).toHaveProperty('error', 'User not found'); 
  });
});


describe('GET /api/users/:userId/goals/:goalId', () => {
  beforeEach(() => {
    users.clear();
    healthProfiles.clear();
    goals.clear();
  })

  test('successfully retrieve a goal by userId and goalId', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);
    
    const userId = createUserResponse.body.id;

    await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send({ height: 140, weight: 70 });

    const goalData = {
      type: 'weight',
      target_value: 50, 
      timeline: '2025-12-31',
      description: 'weight loss'
    };

    const createGoalResponse = await request(app)
      .post(`/api/users/${userId}/goals`)
      .send(goalData);

    const goalId = createGoalResponse.body.id; 

    const response = await request(app)
      .get(`/api/users/${userId}/goals/${goalId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', goalId);
    expect(response.body).toHaveProperty('user-id', userId);
    expect(response.body).toHaveProperty('type', goalData.type);
    expect(response.body).toHaveProperty('target_value', goalData.target_value);
    expect(response.body).toHaveProperty('timeline', goalData.timeline);
    expect(response.body).toHaveProperty('description', goalData.description);
  });

  test('should return 404 when goal ID does not exist', async() => {
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createUserResponse.body.id;

    await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send({ height: 180, weight: 80 }); 

    if (!goals.has(userId)) {
      goals.set(userId, []);
    }

    const fakeGoalId = 'fakegoal';
    
    const response = await request(app)
      .get(`/api/users/${userId}/goals/${fakeGoalId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Goal not found');
  });

  test('should return 404 when userId does not exist', async() => {
    const fakeUserId = 'fakey';
    const fakeGoalId = 'fakersgoal';

    const response = await request(app)
      .get(`/api/users/${fakeUserId}/goals/${fakeGoalId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
}); 


describe('PUT /api/users/:userId/goals/:goalId', () => {
  beforeEach(() => {
    users.clear();
    healthProfiles.clear();
    goals.clear();
  });

  test('should successfully update an existing goal', async() => {
    const createUserResponse = await createTestUser(userData)
    const userId = createUserResponse.body.id; 
    
    await createTestHealthData(userId);
    const createGoalResponse = await createGoal(userId); 
    const goalId = createGoalResponse.body.id;

    const updatedGoalData = {
      type: 'weight',
      target_value: 70.7,
      timeline: '2026-06-30',
      description: 'new weight loss'
    };

    const response = await request(app)
      .put(`/api/users/${userId}/goals/${goalId}`)
      .send(updatedGoalData); 

    expect(response.status).toBe(200); 
    expect(response.body).toHaveProperty('id', goalId);
    expect(response.body).toHaveProperty('user-id', userId);
    expect(response.body).toHaveProperty('type', updatedGoalData.type);
    expect(response.body).toHaveProperty('target_value', updatedGoalData.target_value);
    expect(response.body).toHaveProperty('timeline', updatedGoalData.timeline);
    expect(response.body).toHaveProperty('description', updatedGoalData.description); 
    expect(response.body).toHaveProperty('updated_at');

    const getResponse = await request(app)
      .get(`/api/users/${userId}/goals/${goalId}`); 

    expect(getResponse.body.target_value).toBe(updatedGoalData.target_value);
    expect(getResponse.body.timeline).toBe(updatedGoalData.timeline); 
  });

  test('should return 404 when goal does not exist', async() => {
    const createUserResponse = await createTestUser(userData); 
    const userId = createUserResponse.body.id; 

    await createTestHealthData(userId); 

    const fakeGoalId = 'notrealg'; 
 
    const updatedGoalData = {
      type: 'weight',
      target_value: 70.7,
      timeline: '2026-06-30',
      description: 'new weight loss'
    };

    const response = await request(app)
      .put(`/api/users/${userId}/goals/${fakeGoalId}`)
      .send(updatedGoalData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Goal not found');
  });

  test('should return 400 when update data is invalid', async() => {
    const { userId, goalId } = await setupUserWithGoal(userData);
    
    const invalidGoalData = {
      type: 'weight',
      target_value: -77, 
      timeline: '2026-06-30',
      description: 'Updated goal'
    };

    const response = await request(app)
      .put(`/api/users/${userId}/goals/${goalId}`)
      .send(invalidGoalData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid goal value');
  });

  test('should return 400 when timeline is in the past', async() => { 
    const { userId, goalId } = await setupUserWithGoal(userData);

    const invalidGoalData = {
      type: 'weight',
      target_value: 70, 
      timeline: '2020-05-30',
      description: 'Updated goal'
    }; 

    const response = await request(app)
      .put(`/api/users/${userId}/goals/${goalId}`)
      .send(invalidGoalData); 

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Timeline must be a future date');
  })

  test('should return 404 when user does not exist', async() => {
    const fakeUserId = 'notreal';
    const fakeGoalId = 'fakegoal'; 

    const updatedGoalData = {
      type: 'weight',
      target_value: 77.78, 
      timeline: '2026-06-30',
      description: 'Updated goal'
    };

    const response = await request(app)
      .put(`/api/users/${fakeUserId}/goals/${fakeGoalId}`)
      .send(updatedGoalData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  test('should return 400 when required fields are missing', async() => {
    const { userId, goalId } = await setupUserWithGoal(userData); 

    const incompleteGoalData = {
      type: 'weight',
      timeline: '2026-06-30',
      description: 'updated goal'
    }; 

    const response = await request(app)
      .put(`/api/users/${userId}/goals/${goalId}`)
      .send(incompleteGoalData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });
});


describe('DELETE /api/users/:userId/goals/:goalId', () => {
  beforeEach(() => {
    users.clear();
    healthProfiles.clear();
    goals.clear();
  });

  test('should successfully delete an existing goal', async() => { 
    const { userId, goalId } = await setupUserWithGoal(userData);

    const response = await request(app)
      .delete(`/api/users/${userId}/goals/${goalId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Goal successfully deleted');

    const getResponse = await request(app)
      .get(`/api/users/${userId}/goals/${goalId}`);

    expect(getResponse.status).toBe(404); 
  });

  test('should return 404 when goal does not exist', async() => {
    const createUserResponse = await createTestUser(userData); 
    const userId = createUserResponse.body.id; 

    await createTestHealthData(userId);

    const fakeGoalId = 'unreal goal';

    const response = await request(app)
      .delete(`/api/users/${userId}/goals/${fakeGoalId}`);

    expect(response.status).toBe(404); 
  });

  test('should return 404 when user does not exist', async() => { 
    const fakeUserId = 'unreal user'; 
    const fakeGoalId = 'unreal goal';

    const response = await request(app) 
      .delete(`/api/users/${fakeUserId}/goals/${fakeGoalId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found'); 
  })
});
