const path = require('path')

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database', 'dev.sqlite'),
    logging: false 
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory',
    logging: false
  },
  production: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', '..', 'database', 'production.sqlite'),
    logging: false
  }
};
