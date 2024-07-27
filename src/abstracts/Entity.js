/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// src/abstracts/Entity.js
const { Model, DataTypes } = require('sequelize');
const McDate = require('../Helpers/McDate').default;
const Response = require('../Helpers/Response').default;
const { ucfirst } = require('../Helpers/Utils');

/**
 * Classe base para entidades utilizando Sequelize.
 * Esta classe define métodos comuns para manipulação de entidades
 * e atributos comuns como id, createdAt e updatedAt.
 */
class Entity extends Model {
    static STATUS_ACTIVE = 1;
    static STATUS_INACTIVE = 2;
    static STATUS_DRAFT = 3;
    static STATUS_TRASH = -1;

    /**
     * Inicializa a classe Entity com os atributos fornecidos.
     * @param {Object} attributes - Atributos adicionais para serem inicializados.
     * @param {Object} options - Opções adicionais para a inicialização do modelo.
     * @returns {Model} - Retorna o modelo Sequelize inicializado.
     */
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
            modelType: {
                type: DataTypes.VIRTUAL,
                get() {
                    return this.constructor.name.toLowerCase();
                },
            },
        };

        const allAttributes = {
            ...firstAttributes,
            ...attributes,
            ...lastAttributes,
        };

        options = options || {};
        options.timestamps = true; // Adiciona opção comum para timestamps


        return super.init(allAttributes, options);
    }

    /**
     * Retorna todas as entidades do banco de dados.
     * @returns {Entity[]} - Um array de entidades.
     * @throws {Error} - Lança um erro se não conseguir buscar as entidades.
     */
    static async find() {
        try {
            const entities = await this.findAll();
            return entities;
        } catch (error) {
            throw new Error(`Falha ao buscar entidades: ${error.message}`);
        }
    }

    /**
     * Retorna uma entidade baseada nos filtros fornecidos.
     * @param {*} filter - Filtros para encontrar a entidade desejada.
     * @returns {Entity|null} - A entidade encontrada ou null se não encontrada.
     * @throws {Error} - Lança um erro se não conseguir buscar a entidade.
     */
    static async findBy(filter) {
        try {
            const entity = await this.findOne({ where: filter });
            return entity;
        } catch (error) {
            throw new Error(`Falha ao buscar entidade: ${error.message}`);
        }
    }

    /**
     * Atualiza a entidade com os dados fornecidos.
     * @param {Object} data - Dados para atualizar na entidade.
     * @returns {Object} - Objeto de resposta indicando sucesso ou falha na atualização.
     */
    async update(data) {
        let response;

        try {
            await this.populate(data);
            await this.save();
            response = new Response('success', 'Dados atualizados com sucesso', { entity: this });
            return response.render();
        } catch (error) {
            response = new Response('error', 'Não foi possível atualizar os dados', { entity: this });
            return response.render();
        }
    }

    /**
     * Preenche a entidade com os dados fornecidos.
     * @param {Object} data - Dados para preencher na entidade.
     * @throws {Error} - Lança um erro se ocorrer um problema ao preencher a entidade.
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

    /**
     * Retorna o nome do status baseado no ID do status.
     * @param {int} status - ID do status.
     * @returns {String} - Nome do status em texto pt_BR.
     */
    statusById(status) {
        const _status = {
            [Entity.STATUS_ACTIVE]: 'Ativo',
            [Entity.STATUS_INACTIVE]: 'Inativo',
            [Entity.STATUS_DRAFT]: 'Rascunho',
            [Entity.STATUS_TRASH]: 'Deletado'
        };

        return _status[status];
    }

    /**
     * Retorna o ID do status baseado no nome do status.
     * @param {String} status - Nome do status.
     * @returns {int|null} - ID do status correspondente ou null se não encontrado.
     */
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

    /**
     * Retorna o Nome do status baseado no nome em ingles ou portugues do status.
     * @param {String} status - Nome do status.
     * @returns {int|null} - ID do status correspondente ou null se não encontrado.
     */
    statusIdByName(status) {
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

    async populateDiff(newEntity) {
        for (const key in newEntity) {
            if (this[key] !== newEntity[key]) {
                this[key] = newEntity[key];
            }
        }

        return this;
    }

    static async save() {
        try {
            await this.validate();
            await this.save();
            window.dispatchEvent(new CustomEvent('saveSuccess', { detail: { errors: this } }));
            return {
                error: false,
                data: this
            }
    
        } catch (error) {
            window.dispatchEvent(new CustomEvent('saveErrors', { detail: { errors: error.errors } }));
            return {
                error: true,
                data: error.errors
            }
        }
    }

    async hasMethod(method) {
        if (method in this) {
            return true
        }

        return false;
    }

    async canUserCreate(userId = null) {
        return this.checkPermission('create', userId);
    }

    async canUserView(userId = null) {
       return this.checkPermission('view', userId);
    }

    async canUserModify(userId = null) {
        return this.checkPermission('modify', userId);
    }

    async canUserDelete(userId = null) {
        return this.checkPermission('delete', userId);
    }

    async canUserAlterStatus(userId = null) {
        return this.checkPermission('alsterStatus', userId);
    }

    async checkPermission(action, userId = null) {
        const _userId = userId || globalThis.authUser.id;
        if(await globalThis.authUser.isAdmin(_userId)) {
            return true;
        }
        
        const Permission = require('../models/Permission');
        const objectType = this.constructor.name;
        if(await Permission.findBy({userId: _userId, action: action, objectType: objectType, objectId: this.id})) {
            return true;
        }

        return false;
    }

    async canUser(action, userId = null) {      
        const method = `canUser${ucfirst(action)}`;
        return await eval(`this.${method}(${userId})`);
    }
}

module.exports = Entity;
