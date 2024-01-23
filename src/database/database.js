const Sequelize = require('sequelize');

const sequelize = new Sequelize('bkk6bxjvhjyvlzzddnak', 'uttqjavexpdobbpxn8gv', '9B96BWTCEIMh33KchvxOrJRBtzIs8v', {
  host: 'bkk6bxjvhjyvlzzddnak-postgresql.services.clever-cloud.com', 
  dialect: 'postgres',
  port:50013, 
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;