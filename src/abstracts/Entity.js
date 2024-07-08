// src/abstracts/Entity.js
const { Model, DataTypes } = require('sequelize');

class Entity extends Model {
    static init(attributes, options) {

        const firstAtributes = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
        }

        const LastAttributes = {
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
        }

        const AllAtributes = {
            ...firstAtributes,
            ...attributes,
            ...LastAttributes,
        };

        options = options || {};
        options.timestamps = true; // Adding common option for timestamps
        return super.init(AllAtributes, options);
    }

    /**
     * Devolve todas as entidades
     * @returns Entity[]
     */
    static async find() {
        try {
            const entities = await this.findAll();
            return entities;
        } catch (error) {
            throw new Error(`Failed to fetch entities: ${error.message}`);
        }
    }

    /**
     * Devolve todas as entidades com base nos filtros
     * @param {*} filter 
     * @returns Entity[]
     */
    static async findBy(filter) {
        try {
            const entity = await this.findOne({ where: filter });
            return entity;
        } catch (error) {
            throw new Error(`Failed to fetch entity: ${error.message}`);
        }
    }
}

module.exports = Entity;
