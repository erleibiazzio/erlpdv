// src/database.js
const { Sequelize } = require('sequelize');
const mariadb = require('mariadb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const sequelize = new Sequelize(process.env.VUE_APP_CONF_DB_NAME, process.env.VUE_APP_CONF_DB_USERNAME, process.env.VUE_APP_CONF_DB_PASSWORD, {
  host: process.env.VUE_APP_CONF_DB_HOST,
  dialect: 'mariadb',
  dialectModule: mariadb,
  logging: false
});

async function authenticateAndSync() {
    try {
      await sequelize.authenticate();
      console.log('Banco de dados iniciado com sucesso');
      await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
      console.log('Tabelas sincronizadas');
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
    }
  }
  
  authenticateAndSync();


module.exports = sequelize;
