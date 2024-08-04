/* eslint-disable no-unused-vars */
// src/models/Session.js
const { DataTypes, Op } = require('sequelize');
const sequelize = require('../database');
const Entity = require('../abstracts/Entity');
const { loadModel } = require('../Helpers/loadModels');
const { getPermissionDefinitions } = require('../definitions/permissionsDefinitions');

class PermissionQueue extends Entity {
    /**
     * Executa a fila de permissões, processando cada item e aplicando as permissões conforme necessário.
     */
    async runQueue() {
        const queues = await PermissionQueue.findAll({ where: { status: 0 } });
        if (queues.length === 0) return;

        for (const queue of queues) {
            const permissionDefinitions = getPermissionDefinitions(queue.action);

            queue.update({ status: 1 });

            if (permissionDefinitions.singlePermission) {
                await this.createPermission(queue);
            } else {
                await this.processEntities(queue);
            }

            await queue.destroy();
        }
    }

    /**
     * Cria uma permissão única para um usuário e ação específicos.
     * @param {Object} queue - Item da fila de permissões.
     */
    async createPermission(queue) {
        const Permission = await loadModel('Permission');
        await Permission.create({
            userId: queue.userId,
            action: queue.action,
            objectType: queue.objectType,
        });
    }

    /**
     * Processa entidades e cria permissões para cada uma conforme necessário.
     * @param {Object} queue - Item da fila de permissões.
     */
    async processEntities(queue) {
        const model = await loadModel(queue.objectType);
        let whereClause = {};

        if (queue.objectIds && queue.objectIds.length) {
            whereClause = { id: { [Op.in]: queue.objectIds } };
        }

        const entities = await model.findAll({ where: whereClause });

        for (const entity of entities) {
            if (queue.objectType === "User" && await entity.isAdmin()) continue;
            await this.createPermissionIfNotExists(queue, entity.id);
        }
    }

    /**
     * Cria uma permissão se ela não existir.
     * @param {Object} queue - Item da fila de permissões.
     * @param {Number} entityId - ID da entidade.
     */
    async createPermissionIfNotExists(queue, entityId) {
        const results = await sequelize.query(
            "SELECT id FROM Permissions WHERE objectType = :objType AND objectId = :objId AND userId = :uId AND action = :action",
            {
                replacements: {
                    objType: queue.objectType,
                    objId: entityId,
                    uId: queue.userId,
                    action: queue.action
                },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (results.length === 0) {
            const Permission = await loadModel('Permission');
            await Permission.create({
                userId: queue.userId,
                action: queue.action,
                objectType: queue.objectType,
                objectId: entityId,
            });
        }
    }
}

PermissionQueue.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    objectType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    objectIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: [],
        set(value) {
            this.setDataValue('objectIds', value.length > 0 ? value : null);
        }
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: Entity.STATUS_ACTIVE,
    },
}, {
    sequelize,
    modelName: 'PermissionQueue'
});

module.exports = PermissionQueue;
