/* eslint-disable no-unused-vars */
// src/models/Session.js
const { DataTypes, Op } = require('sequelize');
const sequelize = require('../database');
const Entity = require('../abstracts/Entity');
const { loadModel } = require('../Helpers/loadModels');


class PermissionQueue extends Entity {
    async runQueue() {
        const queues = await PermissionQueue.findAll({ where: { status: 0 } });
        if (queues) {
            for (const queue of queues) {
                queue.status = 1;
                queue.save();

                const model = await loadModel(queue.objectType);

                let complement = {};
                if (queue.objectIds) {
                    complement = { where: { id: { [Op.in]: queue.objectIds } } };
                }

                const entities = await model.findAll(complement);
                if (entities) {
                    for (const entity of entities) {

                        if(queue.objectType == "User" && await entity.isAdmin()) {
                            continue;
                        }

                        const results = await sequelize.query(
                            "SELECT id FROM Permissions WHERE objectType = :objType AND objectId = :objId AND userId = :uId AND action = :action",
                            {
                                replacements: {
                                    objType: queue.objectType,
                                    objId: entity.id,
                                    uId: queue.userId,
                                    action: queue.action
                                },
                                type: sequelize.QueryTypes.SELECT
                            }
                        );

                        if (results.length <= 0) {
                            const Permission = await loadModel('Permission')
                           await Permission.create({
                                userId: queue.userId,
                                action: queue.action,
                                objectType: queue.objectType,
                                objectId: entity.id,
                            })
                        }

                    }
                }

                queue.destroy();
            }
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
