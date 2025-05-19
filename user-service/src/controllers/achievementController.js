const { Op } = require('sequelize');
const db = require('../models');

class AchievementController {
  constructor() {}
  
  getAllAchievements = async (req, res) => {
    try {
      const achievements = await db.Achievement.findAll({
        order: [['type', 'ASC'], ['required_count', 'ASC']]
      });
      
      res.status(200).json(achievements);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getUserAchievements = async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Check if user exists
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get user's achievements with join to Achievement table
      const userAchievements = await db.UserAchievement.findAll({
        where: { user_id: userId },
        include: [{ model: db.Achievement }],
        order: [['achieved_at', 'DESC']]
      });
      
      // Format response
      const formattedAchievements = userAchievements.map(ua => ({
        id: ua.Achievement.achievement_id,
        name: ua.Achievement.name,
        description: ua.Achievement.description,
        type: ua.Achievement.type,
        achieved_at: ua.achieved_at
      }));
      
      res.status(200).json(formattedAchievements);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  awardAchievement = async (req, res) => {
    try {
      const userId = req.params.userId;
      const achievementId = req.params.achievementId;
      
      // Check if user exists
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if achievement exists
      const achievement = await db.Achievement.findByPk(achievementId);
      if (!achievement) {
        return res.status(404).json({ error: 'Achievement not found' });
      }
      
      // Check if user already has this achievement
      const existingAward = await db.UserAchievement.findOne({
        where: {
          user_id: userId,
          achievement_id: achievementId
        }
      });
      
      if (existingAward) {
        return res.status(409).json({ 
          error: 'User has already earned this achievement',
          achieved_at: existingAward.achieved_at
        });
      }
      
      // Award the achievement
      const userAchievement = await db.UserAchievement.create({
        user_id: userId,
        achievement_id: achievementId,
        achieved_at: new Date()
      });
      
      res.status(201).json({
        message: 'Achievement awarded successfully',
        achievement: {
          id: achievement.achievement_id,
          name: achievement.name,
          description: achievement.description,
          type: achievement.type,
          achieved_at: userAchievement.achieved_at
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  checkEligibleAchievements = async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Check if user exists
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Run all achievement checks
      const workoutAchievements = await this.checkWorkoutAchievements(userId);
      const mealAchievements = await this.checkMealLogAchievements(userId);
      const goalAchievements = await this.checkGoalAchievements(userId);
      const streakAchievements = await this.checkWorkoutStreakAchievements(userId);
      const weightAchievements = await this.checkWeightAchievements(userId);
      
      const newAchievements = [
        ...workoutAchievements,
        ...mealAchievements,
        ...goalAchievements,
        ...streakAchievements,
        ...weightAchievements
      ];
      
      res.status(200).json({
        count: newAchievements.length,
        achievements: newAchievements
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Helper methods for checking achievements
  
  /**
   * Award an achievement to a user (internal method)
   */
  async awardAchievementToUser(userId, achievementId) {
    const userAchievement = await db.UserAchievement.create({
      user_id: userId,
      achievement_id: achievementId,
      achieved_at: new Date()
    });
    
    const achievement = await db.Achievement.findByPk(achievementId);
    
    return {
      id: achievement.achievement_id,
      name: achievement.name,
      description: achievement.description,
      type: achievement.type,
      achieved_at: userAchievement.achieved_at
    };
  }
  
  /**
   * Check if a user is eligible for workout-related achievements
   */
  async checkWorkoutAchievements(userId) {
    const newAchievements = [];
    
    // Get all workout-related achievements
    const workoutAchievements = await db.Achievement.findAll({
      where: { type: 'workout' }
    });
    
    // Get user's current workout achievements
    const userWorkoutAchievements = await db.UserAchievement.findAll({
      where: { 
        user_id: userId,
        achievement_id: {
          [Op.in]: workoutAchievements.map(a => a.achievement_id)
        }
      }
    });
    
    const earnedAchievementIds = userWorkoutAchievements.map(ua => ua.achievement_id);
    
    // Get user's workout count
    const workoutCount = await db.WorkoutLog.count({
      where: { user_id: userId }
    });
    
    // Check each achievement
    for (const achievement of workoutAchievements) {
      const ALREADY_EARNED = earnedAchievementIds.includes(achievement.achievement_id);
      
      if (!ALREADY_EARNED) {
        const REQUIREMENT_MET = workoutCount >= achievement.required_count;
        
        if (REQUIREMENT_MET) {
          const achievementData = await this.awardAchievementToUser(userId, achievement.achievement_id);
          newAchievements.push(achievementData);
        }
      }
    }
    
    return newAchievements;
  }
  
  /**
   * Check if a user is eligible for meal-related achievements
   */
  async checkMealLogAchievements(userId) {
    const newAchievements = [];
    
    // Get all meal-related achievements
    const mealAchievements = await db.Achievement.findAll({
      where: { type: 'meal' }
    });
    
    // Get user's current meal achievements
    const userMealAchievements = await db.UserAchievement.findAll({
      where: { 
        user_id: userId,
        achievement_id: {
          [Op.in]: mealAchievements.map(a => a.achievement_id)
        }
      }
    });
    
    const earnedAchievementIds = userMealAchievements.map(ua => ua.achievement_id);
    
    // Get user's meal log count
    const mealCount = await db.MealLog.count({
      where: { user_id: userId }
    });
    
    // Check each achievement
    for (const achievement of mealAchievements) {
      const ALREADY_EARNED = earnedAchievementIds.includes(achievement.achievement_id);
      
      if (!ALREADY_EARNED) {
        const REQUIREMENT_MET = mealCount >= achievement.required_count;
        
        if (REQUIREMENT_MET) {
          const achievementData = await this.awardAchievementToUser(userId, achievement.achievement_id);
          newAchievements.push(achievementData);
        }
      }
    }
    
    return newAchievements;
  }
  
  /**
   * Check if a user is eligible for goal-related achievements
   */
  async checkGoalAchievements(userId) {
    const newAchievements = [];
    
    // Get all goal-related achievements
    const goalAchievements = await db.Achievement.findAll({
      where: { type: 'goal' }
    });
    
    // Get user's current goal achievements
    const userGoalAchievements = await db.UserAchievement.findAll({
      where: { 
        user_id: userId,
        achievement_id: {
          [Op.in]: goalAchievements.map(a => a.achievement_id)
        }
      }
    });
    
    const earnedAchievementIds = userGoalAchievements.map(ua => ua.achievement_id);
    
    // Get user's goal count
    const goalCount = await db.Goal.count({
      where: { user_id: userId }
    });
    
    // Check each achievement
    for (const achievement of goalAchievements) {
      const ALREADY_EARNED = earnedAchievementIds.includes(achievement.achievement_id);
      
      if (!ALREADY_EARNED) {
        const REQUIREMENT_MET = goalCount >= achievement.required_count;
        
        if (REQUIREMENT_MET) {
          const achievementData = await this.awardAchievementToUser(userId, achievement.achievement_id);
          newAchievements.push(achievementData);
        }
      }
    }
    
    return newAchievements;
  }
  
  /**
   * Check for workout streak achievements
   */
  async checkWorkoutStreakAchievements(userId) {
    const newAchievements = [];
    
    // Get all streak-related achievements
    const streakAchievements = await db.Achievement.findAll({
      where: { type: 'streak' }
    });
    
    if (streakAchievements.length === 0) {
      return newAchievements;
    }
    
    // Get user's current streak achievements
    const userStreakAchievements = await db.UserAchievement.findAll({
      where: { 
        user_id: userId,
        achievement_id: {
          [Op.in]: streakAchievements.map(a => a.achievement_id)
        }
      }
    });
    
    const earnedAchievementIds = userStreakAchievements.map(ua => ua.achievement_id);
    
    // Get user's workout logs ordered by date
    const workoutLogs = await db.WorkoutLog.findAll({
      where: { user_id: userId },
      order: [['completed_at', 'ASC']]
    });
    
    if (workoutLogs.length === 0) {
      return newAchievements;
    }
    
    // Calculate current streak
    let currentStreak = 1;
    let previousDate = new Date(workoutLogs[0].completed_at);
    previousDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < workoutLogs.length; i++) {
      const currentDate = new Date(workoutLogs[i].completed_at);
      currentDate.setHours(0, 0, 0, 0);
      
      const timeDifference = currentDate.getTime() - previousDate.getTime();
      const dayDifference = timeDifference / (1000 * 3600 * 24);
      
      if (dayDifference === 1) {
        // Consecutive day
        currentStreak++;
      } else if (dayDifference > 1) {
        // Streak broken
        currentStreak = 1;
      }
      
      previousDate = currentDate;
    }
    
    // Check each achievement
    for (const achievement of streakAchievements) {
      const ALREADY_EARNED = earnedAchievementIds.includes(achievement.achievement_id);
      
      if (!ALREADY_EARNED) {
        const REQUIREMENT_MET = currentStreak >= achievement.required_count;
        
        if (REQUIREMENT_MET) {
          const achievementData = await this.awardAchievementToUser(userId, achievement.achievement_id);
          newAchievements.push(achievementData);
        }
      }
    }
    
    return newAchievements;
  }
  
  /**
   * Check for weight loss/gain achievements
   */
  async checkWeightAchievements(userId) {
    const newAchievements = [];
    
    // Get user's health profile
    const healthProfile = await db.HealthProfile.findOne({
      where: { user_id: userId }
    });
    
    if (!healthProfile) {
      return newAchievements;
    }
    
    // Get all weight-related achievements
    const weightAchievements = await db.Achievement.findAll({
      where: { type: 'weight' }
    });
    
    // Get user's current weight achievements
    const userWeightAchievements = await db.UserAchievement.findAll({
      where: { 
        user_id: userId,
        achievement_id: {
          [Op.in]: weightAchievements.map(a => a.achievement_id)
        }
      }
    });
    
    const earnedAchievementIds = userWeightAchievements.map(ua => ua.achievement_id);
    
    // Get user's weight-related goals
    const weightGoals = await db.Goal.findAll({
      where: { 
        user_id: userId,
        type: 'weight' 
      }
    });
    
    if (weightGoals.length === 0) {
      return newAchievements;
    }
    
    // Check each achievement
    for (const achievement of weightAchievements) {
      const ALREADY_EARNED = earnedAchievementIds.includes(achievement.achievement_id);
      
      if (!ALREADY_EARNED) {
        // For weight achievements, we'll check if they've reached any weight goals
        const completedWeightGoals = weightGoals.filter(goal => {
          // For weight loss goals
          if (goal.target_value < healthProfile.weight) {
            return healthProfile.weight <= goal.target_value;
          }
          // For weight gain goals
          else if (goal.target_value > healthProfile.weight) {
            return healthProfile.weight >= goal.target_value;
          }
          return false;
        });
        
        const REQUIREMENT_MET = completedWeightGoals.length >= achievement.required_count;
        
        if (REQUIREMENT_MET) {
          const achievementData = await this.awardAchievementToUser(userId, achievement.achievement_id);
          newAchievements.push(achievementData);
        }
      }
    }
    
    return newAchievements;
  }
}

module.exports = AchievementController;