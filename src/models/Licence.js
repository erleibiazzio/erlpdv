// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Entity = require('../abstracts/Entity');
const McDate = require('../Helpers/McDate');


class Licence extends Entity {

    /**
     * Devolve a instancia da licença
     * @return Licence
     */
    static async getLicence() {
        try {
            const entity = await this.findOne();
            return entity;
        } catch (error) {
            throw new Error(`Failed to fetch entity: ${error.message}`);
        }
    }

    /**
     * verifica se a instancia esta ativa
     * @return Bollean
     */
    static async isActive() {
        let licence = await this.getLicence();
        let isActive = false;
        
        if(licence) {
            let expiration = new McDate(licence.expiration);
            if(expiration.isFuture() && licence.status) {
                isActive = true;
            }
        }
      
        return isActive;
    }
}

Licence.init({
    organization: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    serial: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Licence'
});

module.exports = Licence;
