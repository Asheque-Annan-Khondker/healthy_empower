const { validateGoalData } = require('../utils/validation.js'); 
const db = require('../models');

class GoalController {  
  constructor() { 
  }


  getGoalById = async (req, res) => {
    try {
      const userId = req.params.userId;
      const goalId = req.params.goalId

      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found'});
      }
      
      const goal = await db.Goal.findOne({
        where: {
          goal_id: goalId,
          user_id: userId
        }
      });
      
      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }
     
      res.status(200).json({
        goal_id: goal.goal_id, 
        user_id: goal.user_id, 
        type: goal.type,
        target_value: goal.target_value,
        start_date: goal.start_date,
        target_date: goal.target_date,
        description: goal.description,
        created_at: goal.createdAt,
        updated_at: goal.updatedAt
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getAllGoals =  async (req, res) => {
    try {
      const userId = req.params.userId;

    // Check if user exists
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found'});
      }
    
      // Get all goals for the user
      const userGoals = await db.Goal.findAll({
       where: { user_id: userId }
      });

      // Map goals to response format
      const formattedGoals = userGoals.map(goal => ({
        goal_id: goal.goal_id,
        user_id: goal.user_id,
        type: goal.type,
        target_value: goal.target_value,
        start_date: goal.start_date,
        target_date: goal.target_date,
        description: goal.description,
        created_at: goal.createdAt,
        updated_at: goal.updatedAt
      }));
    
      res.status(200).json(formattedGoals);    
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  updateGoal = async (req, res) => {
    try {
      const userId = req.params.userId;
      const goalId = req.params.goalId;
      const goalData = req.body;

      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const goal = await db.Goal.findOne({
        where: {
          goal_id: goalId,
          user_id: userId
        }
      });

      
      if (!goal) {
        return res.status(404).json({ error: 'Goal not found'});
      }

      const validation = validateGoalData(goalData, true);
      const VALIDATION_FAILED = !validation.isValid;
      if (VALIDATION_FAILED) {
        return res.status(400).json({ error: validation.error }); 
      }
      
      await goal.update({
        type: goalData.type, 
        target_value: goalData.target_value,
        target_date: new Date(goalData.timeline),
        description: goalData.description
      });

      const updatedGoal = await db.Goal.findByPk(goal.goal_id);

      res.status(200).json({
        goal_id: updatedGoal.goal_id,
        user_id: updatedGoal.user_id,
        type: updatedGoal.type,
        target_value: updatedGoal.target_value,
        start_date: updatedGoal.start_date,
        target_date: updatedGoal.target_date,
        description: updatedGoal.description,
        created_at: updatedGoal.createdAt,
        updated_at: updatedGoal.updatedAt
      });
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
  } 

  deleteGoal = async (req,res) => { 
    try {
      const userId = req.params.userId;
      const goalId = req.params.goalId; 
    
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found'}); 
      }

      const goal = await db.Goal.findOne({
        where: {
          goal_id: goalId,
          user_id: userId
        }
      });

      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' }); 
      }

      await goal.destroy();

      res.status(200).json({ message: 'Goal successfully deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  createGoal = async (req, res) => {
    try {
      const userId = req.params.userId;
      const goalData = req.body;

      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const healthProfile = await db.HealthProfile.findOne({
        where: { user_id: userId }
      });
      const hasHealthProfile = !!healthProfile;


      const validation = validateGoalData(goalData, hasHealthProfile);
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }

      
      const newGoal = await db.Goal.create({
        user_id: userId,
        type: goalData.type,
        target_value: goalData.target_value,
        start_date: new Date(),
        target_date: new Date(goalData.timeline),
        description: goalData.description
      });

    
      res.status(201).json({
        goal_id: newGoal.goal_id,
        user_id: newGoal.user_id,
        type: newGoal.type,
        target_value: newGoal.target_value,
        start_date: newGoal.start_date,
        target_date: newGoal.target_date,
        description: newGoal.description,
        created_at: newGoal.createdAt,
        updated_at: newGoal.updatedAt
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


}


module.exports = GoalController; 
