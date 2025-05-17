const { Op } = require('sequelize');
const db = require('../models');
const { default: buildSeqWhere } = require('../utils/buildSeqWhere');
const get = require('../utils/universalGet');

class FoodController {
  // Get all foods with pagination and search
  // req = request, res = response
  getAllFoods = async (req, res) => {
    try {
      const { search, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      
      // Build where clause for search
      const whereClause = {};
      if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
      }
      
      const foods = await db.Food.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [{ model: db.UnitOfMeasurement }],
        order: [['name', 'ASC']]
      });
      
      res.status(200).json({
        foods: foods.rows,
        totalCount: foods.count,
        totalPages: Math.ceil(foods.count / limit),
        currentPage: parseInt(page)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  get = get(db.Food, [{ model: db.UnitOfMeasurement }])
  // Get food by ID
  getFoodById = async (req, res) => {
    try {
      const foodId = req.params.id;
      const food = await db.Food.findByPk(foodId, {
        include: [{ model: db.UnitOfMeasurement }]
      });
      
      if (!food) {
        return res.status(404).json({ error: 'Food not found' });
      }
      
      res.status(200).json(food);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // Create new food
  createFood = async (req, res) => {
    try {
      console.log("Request body: ", req.body)
      const { name, calories, protein, carbs, fat, serving_size, serving_unit_id } = req.body;
      console.log("Parsed Values:", {name, calories, protein, carbs, fat, serving_size, serving_unit_id});


      // Validation
      const REQUIRED_FIELDS_MISSING = !name;
      if (REQUIRED_FIELDS_MISSING) {
        return res.status(400).json({ error: 'Food name is required' });
      }

      console.log("creating food in database");

      
      const INVALID_NUTRITION_VALUES = 
        (calories !== undefined && calories < 0) || 
        (protein !== undefined && protein < 0) || 
        (carbs !== undefined && carbs < 0) || 
        (fat !== undefined && fat < 0);
      
      if (INVALID_NUTRITION_VALUES) {
        return res.status(400).json({ error: 'Nutrition values cannot be negative' });
      }
      
      // Create the food
      const food = await db.Food.create({
        name,
        calories: calories || 0,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
        serving_size,
        serving_unit_id
      });

      console.log("food created:", food.food_id);
      
      // Fetch with unit info
      console.log("Fetching created food with unit info");
      const createdFood = await db.Food.findByPk(food.food_id, {
        include: [{ model: db.UnitOfMeasurement }]
      });
      
      res.status(201).json(createdFood);
    } catch (error) {
      console.log("error:", error); 
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = FoodController;
