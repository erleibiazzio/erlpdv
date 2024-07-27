// src/models/Session.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Entity = require('../abstracts/Entity');

class Role extends Entity {
    // Defina atributos específicos do modelo role, se necessário
}

Role.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
    modelName: 'Role'
});

module.exports = Role;
