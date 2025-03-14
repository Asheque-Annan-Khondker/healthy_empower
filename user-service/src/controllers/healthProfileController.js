const { validateHealthData, validateGoalData } = require('../utils/validation.js'); 



class HealthProfileController {
  constructor(users, healthProfiles, goals) {
    this.users = users; 
    this.healthProfiles = healthProfiles; 
    this.goals = goals; 
  }
 
  createHealthProfile = (req, res) => {
    try {
      const userId = req.params.id; 
      const healthData = req.body;
    
    const user = this.users.get(userId); 
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
     
    this.healthProfiles.set(userId, healthProfile);
    res.status(201).json(healthProfile);
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
}



 getHealthProfile = (req, res) => {
  try {
    const userId = req.params.id; 

    const user = this.users.get(userId); 
    if (!user) {
      return res.status(404).json({ error: "User not found"});
    }
  
  
  const healthProfile = this.healthProfiles.get(userId);
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
}


 createGoal = (req, res) => {
  try {
    const userId = req.params.id;
    const goalData = req.body;

    const user = this.users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hasHealthProfile = this.healthProfiles.has(userId);
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
    if (!this.goals.has(userId)) {
      this.goals.set(userId, []);
    }
    goals.get(userId).push(newGoal);

    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


updateHealthProfile = (req, res) => {
  try {
    const userId = req.params.id; 
    const healthData = req.body; 

    const user = this.users.get(userId); 
    if (!user) {
      return res.status(404).json({ error: 'User not found'});
    }

    const existingHealthProfile = this.healthProfiles.get(userId); 
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

    this.healthProfiles.set(userId, updatedHealthProfile);

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
  }
}

module.exports = HealthProfileController; 
