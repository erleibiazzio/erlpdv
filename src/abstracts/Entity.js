// src/abstracts/Entity.js
const { Model, DataTypes } = require('sequelize');
const McDate = require('../Helpers/McDate').default;
const Response = require('../Helpers/Response').default;

class Entity extends Model {
    static STATUS_ACTIVE = 1;
    static STATUS_INACTIVE = 2;
    static STATUS_DRAFT = 3;
    static STATUS_TRASH = -1;

    static init(attributes, options) {
        const firstAttributes = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
        };

        const lastAttributes = {
            statusName: {
                type: DataTypes.VIRTUAL,
                get() {
                    return this.statusById(this.getDataValue('status'));
                },
            },
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

    statusById(status) {
        const _status = {
            [Entity.STATUS_ACTIVE]: 'Ativo',
            [Entity.STATUS_INACTIVE]: 'Inativo',
            [Entity.STATUS_DRAFT]: 'Rascunho',
            [Entity.STATUS_TRASH]: 'Deletado'
        }

        return _status[status];
    }

    statusByName(status) {
        let result = null;
        switch (status) {
            case 'Ativo':
            case 'ativo':
            case 'enabled':
            case 'Enabled':
                result = Entity.STATUS_ACTIVE
                break;
            case 'Inativo':
            case 'inativo':
            case 'disabled':
            case 'Disabled':
                result = Entity.STATUS_INACTIVE
                break;
            case 'Rascunho':
            case 'rascunho':
            case 'draft':
            case 'Draft':
                result = Entity.STATUS_DRAFT
                break;
            case 'Deletado':
            case 'deletado':
            case 'trash':
            case 'Trash':
                result = Entity.STATUS_TRASH
                break;

            default:
            result = status;
                break;
        }

        return result;
    }

    statusByNamePt(status) {
        let result = null;
        switch (status) {
            case 'Ativo':
            case 'ativo':
            case 'enabled':
            case 'Enabled':
                result = this.statusById(Entity.STATUS_ACTIVE)
                break;
            case 'Inativo':
            case 'inativo':
            case 'disabled':
            case 'Disabled':
                result = this.statusById(Entity.STATUS_INACTIVE)
                break;
            case 'Rascunho':
            case 'rascunho':
            case 'draft':
            case 'Draft':
                result = this.statusById(Entity.STATUS_DRAFT)
                break;
            case 'Deletado':
            case 'deletado':
            case 'trash':
            case 'Trash':
                result = this.statusById(Entity.STATUS_TRASH)
                break;

            default:
            result = status;
                break;
        }

        return result;
    }

}

module.exports = Entity;
