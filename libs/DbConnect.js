const { Sequelize } = require('sequelize');

// "dotenv" is a library to accdcess ".env" file
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_IP,
    dialect: 'mysql',
  }
);

module.exports = sequelize;