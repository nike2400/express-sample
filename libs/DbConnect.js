const { Sequelize } = require('sequelize');
// "dotenv" is a library to accdcess ".env" file
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_ROOT_HOST,
    port: process.env.DB_PORT, // Check what port MySQL is using.
    dialect: 'mysql',
    // Please add this line below if you cannot access to the database
    // dialectOptions: {
    //   // Set your path to mysql.sock
    //   socketPath: '/your_path_to/tmp/mysql/mysql.sock'
    // }
  });

module.exports = sequelize;