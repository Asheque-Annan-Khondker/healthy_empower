const { validateHealthData, validateGoalData } = require('../utils/validation.js'); 
const db = require('../models');
const {get} = require('../utils/universalDML')


class HealthProfileController {
  constructor(users, healthProfiles, goals) {
    // Set up the universal get method for general queries
    this.get = require('../utils/universalGet.js')(require('../models').HealthProfile);
  }
 
  createHealthProfile = async (req, res) => {
    try {
      const userId = req.params.id; 
      const healthData = req.body;
    
    const user = await db.User.findByPk(userId); 
    if (!user) {
      return res.status(404).json({error: 'User not found'}); 
    }

    const validation = validateHealthData(healthData);
    if (!validation.isValid) {
      return res.status(400).json({error: validation.error}); 
    }

    const healthProfile = await db.HealthProfile.create({
      user_id: userId, 
      height: healthData.height,
      weight: healthData.weight,
      recorded_at: new Date()
    });
    console.log("healthprofile created");
    res.status(201).json({
      'user-id': healthProfile.user_id,
      height: healthProfile.height,
      weight: healthProfile.weight,
      recorded_at: healthProfile.recorded_at
    });
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
}

  getHealthProfile = async (req, res) => {
  try {
    const userId = req.params.id; 

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found"});
    }
  
  
    const healthProfile = await db.HealthProfile.findOne({
      where: { user_id: userId }
    }); 
  
    if (!healthProfile) {
      return res.status(404).json({ error: "health profile not found"});
    }

    res.status(200).json({
      'user-id': healthProfile.user_id,
      height: healthProfile.height,
      weight: healthProfile.weight,
      recorded_at: healthProfile.recorded_at
    });
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


  updateHealthProfile = async (req, res) => {
  try {
    const userId = req.params.id; 
    const healthData = req.body; 

    const user =  await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found'});
    }

    const healthProfile = await db.HealthProfile.findOne({
      where: { user_id: userId }
    });

    if (!healthProfile) {
      return res.status(404).json({ error: 'Health profile not found'});
    }

    const validation = validateHealthData(healthData); 
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error }); 
    }

    await healthProfile.update({
      height: healthData.height,
      weight: healthData.weight
    });


    res.status(200).json({
      'user-id': userId,
      height: healthProfile.height,
      weight: healthProfile.weight,
      created_at: healthProfile.created_at, // existingHealthProfile.created_at referenced
      updated_at: healthProfile.updated_at
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
    }
  } 
}


module.exports = HealthProfileController; 
