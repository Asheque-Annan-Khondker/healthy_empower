const { Op } = require('sequelize');
const db = require('../models');
const { post, get } = require('../utils/universalDML');

class MealLogController {
  // Create meal log
  createMealLog = async (req, res) => {
    try {
      const userId = req.params.userId;
      const { food_id, meal_type, servings, logged_at } = req.body;
      
      // Validation
      const REQUIRED_FIELDS_MISSING = !food_id || !servings;
      if (REQUIRED_FIELDS_MISSING) {
        return res.status(400).json({ error: 'Food ID and servings are required' });
      }
      
      const INVALID_SERVINGS = servings <= 0;
      if (INVALID_SERVINGS) {
        return res.status(400).json({ error: 'Servings must be greater than zero' });
      }
      
      // Check if user exists
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if food exists
      const food = await db.Food.findByPk(food_id);
      if (!food) {
        return res.status(404).json({ error: 'Food not found' });
      }
      
      // Create meal log
      const mealLog = await db.MealLog.create({
        user_id: userId,
        food_id,
        meal_type: meal_type || 'snack',
        servings,
        logged_at: logged_at ? new Date(logged_at) : new Date()
      });
      
      console.log('✅ MealLog Controller: Successfully created meal log with ID:', mealLog.meal_id);
      
      // Return with food details
      const result = await db.MealLog.findByPk(mealLog.meal_id, {
        include: [{ 
          model: db.Food,
          include: [{ model: db.UnitOfMeasurement }]
        }]
      });
      
      res.status(201).json(result);
    } catch (error) {
      console.error('❌ MealLog Controller: Error creating meal log:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  get = get(db.MealLog)
  
  // Get meal logs with filtering
  getMealLogs = async (req, res) => {
    try {
      const userId = req.params.userId;
      const { date, start_date, end_date, meal_type, page = 1, limit = 20, fetch_type = 'daily' } = req.query;
      const offset = (page - 1) * limit;
      
      // Check if user exists
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Build where clause
      const whereClause = { user_id: userId };
      
      // Optimize for monthly fetching
      if (fetch_type === 'monthly' && date) {
        // Monthly optimization: fetch entire month
        const targetDate = new Date(date);
        const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1);
        
        whereClause.logged_at = {
          [Op.gte]: startOfMonth,
          [Op.lt]: endOfMonth
        };
        
        // For monthly queries, remove pagination to get all data
        const mealLogs = await db.MealLog.findAndCountAll({
          where: whereClause,
          include: [{
            model: db.Food,
            include: [{ model: db.UnitOfMeasurement }]
          }],
          order: [['logged_at', 'ASC']] // Order by date for better client-side processing
        });
        
        return res.status(200).json({
          logs: mealLogs.rows,
          totalCount: mealLogs.count,
          fetchType: 'monthly',
          month: `${targetDate.getFullYear()}-${targetDate.getMonth()}`
        });
        
      } else if (date) {
        // Single date filtering (legacy support)
        const targetDate = new Date(date);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        whereClause.logged_at = {
          [Op.gte]: targetDate,
          [Op.lt]: nextDay
        };
      } else if (start_date && end_date) {
        // Date range filtering
        whereClause.logged_at = {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        };
      }
      
      if (meal_type) {
        whereClause.meal_type = meal_type;
      }
      
      // Get meal logs with pagination for non-monthly queries
      const mealLogs = await db.MealLog.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [{
          model: db.Food,
          include: [{ model: db.UnitOfMeasurement }]
        }],
        order: [['logged_at', 'DESC']]
      });
      
      res.status(200).json({
        logs: mealLogs.rows,
        totalCount: mealLogs.count,
        totalPages: Math.ceil(mealLogs.count / limit),
        currentPage: parseInt(page),
        fetchType: 'paginated'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // Update meal log
  updateMealLog = async (req, res) => {
    try {
      const userId = req.params.userId;
      const logId = req.params.logId;
      const { food_id, meal_type, servings, logged_at } = req.body;
      
      // Check if user exists
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if meal log exists and belongs to user
      const mealLog = await db.MealLog.findOne({
        where: {
          meal_id: logId,
          user_id: userId
        }
      });
      
      if (!mealLog) {
        return res.status(404).json({ error: 'Meal log not found' });
      }
      
      // Validation
      if (servings !== undefined) {
        const INVALID_SERVINGS = servings <= 0;
        if (INVALID_SERVINGS) {
          return res.status(400).json({ error: 'Servings must be greater than zero' });
        }
      }
      
      // Update meal log
      await mealLog.update({
        food_id: food_id !== undefined ? food_id : mealLog.food_id,
        meal_type: meal_type !== undefined ? meal_type : mealLog.meal_type,
        servings: servings !== undefined ? servings : mealLog.servings,
        logged_at: logged_at ? new Date(logged_at) : mealLog.logged_at
      });
      
      // Return updated log
      const updatedLog = await db.MealLog.findByPk(logId, {
        include: [{
          model: db.Food,
          include: [{ model: db.UnitOfMeasurement }]
        }]
      });
      
      res.status(200).json(updatedLog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // Delete meal log
  deleteMealLog = async (req, res) => {
    try {
      const userId = req.params.userId;
      const logId = req.params.logId;
      
      // Check if user exists
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if meal log exists and belongs to user
      const mealLog = await db.MealLog.findOne({
        where: {
          meal_id: logId,
          user_id: userId
        }
      });
      
      if (!mealLog) {
        return res.status(404).json({ error: 'Meal log not found' });
      }
      
      // Delete meal log
      await mealLog.destroy();
      
      res.status(200).json({ message: 'Meal log successfully deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MealLogController;
