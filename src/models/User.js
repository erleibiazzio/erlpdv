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
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'User'
});

module.exports = User;
