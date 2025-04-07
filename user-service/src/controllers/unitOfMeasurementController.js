const db = require('../models');

class UnitOfMeasurementController {
  // Get all units
  getAllUnits = async (req, res) => {
    try {
      const units = await db.UnitOfMeasurement.findAll({
        order: [['name', 'ASC']]
      });
      
      res.status(200).json(units);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UnitOfMeasurementController;
