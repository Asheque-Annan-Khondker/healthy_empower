const { validateGoalData } = require('../utils/validation.js'); 

class GoalController {  
  constructor(users, healthProfiles, goals) { 
    this.users = users; 
    this.healthProfiles = healthProfiles;
    this.goals = goals; 
  }


  getAllGoals = (req, res) => {
    try {
      const userId = req.params.id;

      const user = this.users.get(userId); 
      if (!user) {
        return res.status(404).json({ error: 'User not found'});
      }

      if (!this.goals.has(userId)) {
       return res.status(200).json([]);
      }
    
      const userGoals = this.goals.get(userId);

      res.status(200).json(userGoals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getGoalById = (req, res) => {
    try {
      const userId = req.params.userId;
      const goalId = req.params.goalId;


      const user = this.users.get(userId); 
      if (!user) {
        return res.status(404).json({ error: 'User not found'})
      }

      const userGoals = this.goals.get(userId) || [];
      const goal = userGoals.find(g => g.id == goalId); 

      if (!goal) {
        return res.status(404).json({ error: 'Goal not found'}); 
      }

      res.status(200).json(goal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  updateGoal = (req, res) => {
    try {
      const userId = req.params.userId;
      const goalId = req.params.goalId;
      const goalData = req.body;

      const user = this.users.get(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userGoals = this.goals.get(userId) || [];
      const goalIndex = userGoals.findIndex(currentGoal => currentGoal.id === goalId);
    
      const INDEX_NOT_FOUND = goalIndex === -1 
      if (INDEX_NOT_FOUND) {
        return res.status(404).json({ error: 'Goal not found'});
      }

      const validation = validateGoalData(goalData, true);
      const VALIDATION_FAILED = !validation.isValid;
      if (VALIDATION_FAILED) {
        return res.status(400).json({ error: validation.error }); 
      }

      const existingGoal = userGoals[goalIndex];
      const updatedGoal = {
        ...existingGoal,
        type: goalData.type,
        target_value: goalData.target_value,
        timeline: goalData.timeline,
        description: goalData.description,
        updated_at: new Date()
      };

      userGoals[goalIndex] = updatedGoal;

      res.status(200).json(updatedGoal);
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
  } 

  deleteGoal = (req,res) => { 
    try {
      const userId = req.params.userId;
      const goalId = req.params.goalId; 
    
      const user = this.users.get(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found'}); 
      }

      if (!this.goals.has(userId)) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      const userGoals = this.goals.get(userId); 
      const goalIndex = userGoals.findIndex(goal => goal.id === goalId);

      const GOAL_DOES_NOT_EXIST = goalIndex === -1; 

      if (GOAL_DOES_NOT_EXIST) {
        return res.status(404).json({ error: 'Goal not found'});
      }

      userGoals.splice(goalIndex, 1);

      res.status(200).json({ message: 'Goal successfully deleted' });
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
      this.goals.get(userId).push(newGoal);

      res.status(201).json(newGoal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


}


module.exports = GoalController; 
