// src/models/Session.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Entity = require('../abstracts/Entity');

class Permission extends Entity {
    // Defina atributos específicos do modelo Session, se necessário
}

Permission.init({
    entity: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    objectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    objectType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
   
}, {
    sequelize,
    modelName: 'Permission'
});

module.exports = Permission;
