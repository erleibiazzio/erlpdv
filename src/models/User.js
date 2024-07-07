// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Entity = require('../abstracts/Entity');

class User extends Entity {
  // Defina atributos específicos do modelo User, se necessário
}

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  modelName: 'User'
});

module.exports = User;
