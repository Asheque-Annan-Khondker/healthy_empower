const { sequelize } = require('../../models');


async function resetDatabase() {
  await sequelize.sync({ force: true }); 
}

async function closeDatabase() {
  await sequelize.close();
}


module.exports = {
  resetDatabase, 
  closeDatabase
}; 
