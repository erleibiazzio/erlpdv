// src/abstracts/Entity.js
const { Model, DataTypes } = require('sequelize');
const McDate = require('../Helpers/McDate').default;
const Response = require('../Helpers/Response').default;

class Entity extends Model {
    static init(attributes, options) {
        const firstAttributes = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
        };

        const lastAttributes = {
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                get() {
                    const rawValue = this.getDataValue('createdAt');
                    return new McDate(rawValue);
                },
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                get() {
                    const rawValue = this.getDataValue('updatedAt');
                    return new McDate(rawValue);
                },
            },
        };

        const allAttributes = {
            ...firstAttributes,
            ...attributes,
            ...lastAttributes,
        };

        options = options || {};
        options.timestamps = true; // Adding common option for timestamps
        return super.init(allAttributes, options);
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

    /**
     * Atualiza a entidade com os dados fornecidos
     * @param {Object} data 
     * @returns Entity
     */
    async update(data) {
        let response;

        try {
            await this.populate(data);
            await this.save();
            response = new Response('success', 'Dados atualizados com sucesso', { entity: this });
            return response.render();
        } catch (error) {
            response = new Response('error', 'Não foi possivel atualizar os dados', { entity: this });
            return response.render();
        }
    }

    /**
     * Faz a população da entidade
     * @param { object } data 
     */
    async populate(data) {
        try {
            Object.keys(data).forEach((field) => {
                this[field] = data[field];
            });
        } catch (error) {
            throw new Error(`Erro ao popular a entidade: ${error.message}`);
        }
    }
}

module.exports = Entity;
