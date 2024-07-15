// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Entity = require('../abstracts/Entity');
const McDate = require('../Helpers/McDate').default;


class Licence extends Entity {

    /**
     * Devolve a instancia da licença
     * @return Licence
     */
    static async getLicence() {
        try {
            const entity = await this.findBy();
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
            if(licence.expiration.isFuture() && licence.status && licence.serial) {
                isActive = true;
            }
        }
      
        return isActive;
    }    
}

Licence.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    document: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organization: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'O Nome da empresa é obrigatório'
            },
            notEmpty: {
                msg: 'O Nome da empresa é obrigatório'
            },
        }
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        get() {
            const rawValue = this.getDataValue('expiration');
            return new McDate(rawValue);
        }
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    serial: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A chave de ativação é obrigatória'
            },
            notEmpty: {
                msg: 'A chave de ativação é obrigatória'
            },
        }
    }
}, {
    sequelize,
    modelName: 'Licence'
});

module.exports = Licence;
